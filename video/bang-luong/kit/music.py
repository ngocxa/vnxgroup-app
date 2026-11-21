# Nhạc nền tự soạn cho video hướng dẫn (bản quyền thuộc VNXGroup Software)
import numpy as np, sys, wave
from scipy.signal import fftconvolve, butter, sosfilt

SR = 44100
DUR = float(sys.argv[1]) if len(sys.argv) > 1 else 272.0
OUT = sys.argv[2] if len(sys.argv) > 2 else 'music.wav'
BPM = 96
BEAT = 60 / BPM
BAR = 4 * BEAT
N = int(DUR * SR)
rng = np.random.default_rng(7)

def hz(m): return 440 * 2 ** ((m - 69) / 12)
def env_adsr(n, a, d, s, r):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    e = np.full(n, s, float)
    e[:a] = np.linspace(0, 1, a) if a else 1
    e[a:a + d] = np.linspace(1, s, len(e[a:a + d]))
    if r: e[-r:] *= np.linspace(1, 0, min(r, n))
    return e
def lp(x, fc, order=2): return sosfilt(butter(order, fc / (SR / 2), 'low', output='sos'), x)
def hp(x, fc, order=2): return sosfilt(butter(order, fc / (SR / 2), 'high', output='sos'), x)
def put(buf, x, t):
    i = int(t * SR)
    if i >= len(buf): return
    j = min(len(buf), i + len(x)); buf[i:j] += x[:j - i]

# Vòng hợp âm: Cmaj9 – G6 – Am7 – Fmaj7 (sáng, nhẹ nhàng)
PROG = [
    (48, [60, 64, 67, 71, 74]),   # Cmaj9
    (43, [59, 62, 67, 69, 74]),   # G6/9
    (45, [60, 64, 67, 69, 72]),   # Am7
    (41, [60, 64, 65, 69, 72]),   # Fmaj7
]
pad = np.zeros(N); keys = np.zeros(N); bass = np.zeros(N); drums = np.zeros(N); bell = np.zeros(N)

nbars = int(DUR / BAR) + 2
INTRO = 6.6          # cảnh mở đầu: chỉ pad + chuông
OUTRO = DUR - 8.0    # cảnh kết: bỏ trống, pad ngân

for b in range(nbars):
    t0 = b * BAR
    if t0 > DUR: break
    root, chord = PROG[b % 4]
    # PAD: saw lệch tông, lọc mềm
    n = int(BAR * SR * 1.15); tt = np.arange(n) / SR
    p = np.zeros(n)
    for m in chord[:4]:
        for det in (-0.08, 0.08):
            f = hz(m) * 2 ** (det / 12)
            p += 2 * ((tt * f) % 1) - 1
    p = lp(p, 1400) * env_adsr(n, 0.6, 0.3, 0.8, 0.7) * 0.035
    put(pad, p, t0)
    # BASS: sin + bội âm nhẹ ở phách 1 và 3 (từ sau intro)
    if t0 >= INTRO - 0.5 and t0 < OUTRO:
        for k, ln in ((0, 1.6), (2, 1.3)):
            n = int(BEAT * ln * SR); tt = np.arange(n) / SR; f = hz(root)
            x = (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt * 2.2) * 0.22
            x *= env_adsr(n, 0.005, 0.05, 1, 0.05)
            put(bass, x, t0 + k * BEAT)
    # KEYS: rải hợp âm nốt móc đơn kiểu electric piano
    if t0 >= INTRO - 0.5 and t0 < OUTRO + BAR:
        pat = [0, 2, 3, 4, 1, 3, 2, 4]
        for k in range(8):
            if (b % 8 in (3, 7)) and k in (6, 7): continue   # nghỉ cuối câu
            m = chord[pat[k]] + (12 if (b // 4) % 2 and k == 4 else 0)
            n = int(BEAT * 1.6 * SR); tt = np.arange(n) / SR; f = hz(m)
            x = (np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * 2 * f * tt) * np.exp(-tt * 6) + 0.08 * np.sin(2 * np.pi * 3 * f * tt) * np.exp(-tt * 9))
            x *= np.exp(-tt * 3.2) * env_adsr(n, 0.004, 0.02, 1, 0.08) * (0.075 if k % 2 == 0 else 0.055)
            put(keys, x, t0 + k * BEAT / 2 + (0.012 if k % 2 else 0))   # hơi swing
    # BELL: điểm xuyết đầu mỗi 4 ô nhịp
    if b % 4 == 0 or t0 < INTRO:
        m = chord[-1] + 12; n = int(2.5 * SR); tt = np.arange(n) / SR; f = hz(m)
        x = (np.sin(2 * np.pi * f * tt) + 0.4 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt * 4)) * np.exp(-tt * 1.6) * 0.05
        put(bell, x, t0)
    # DRUMS: kick 1 & 3, snare nhẹ 2 & 4, hi-hat móc đơn
    if t0 >= INTRO and t0 < OUTRO:
        for k in range(4):
            tb = t0 + k * BEAT
            if k in (0, 2):
                n = int(0.35 * SR); tt = np.arange(n) / SR
                f = 50 + 70 * np.exp(-tt * 28)
                put(drums, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) * 0.32, tb)
            else:
                n = int(0.22 * SR); tt = np.arange(n) / SR
                sn = hp(rng.standard_normal(n), 1500) * np.exp(-tt * 22) * 0.07 + np.sin(2 * np.pi * 190 * tt) * np.exp(-tt * 30) * 0.05
                put(drums, sn, tb)
        for k in range(8):
            n = int(0.06 * SR); tt = np.arange(n) / SR
            h = hp(rng.standard_normal(n), 7000) * np.exp(-tt * 70) * (0.028 if k % 2 else 0.018)
            put(drums, h, t0 + k * BEAT / 2 + (0.012 if k % 2 else 0))

# Reverb đơn giản
ir_n = int(2.2 * SR); ir_t = np.arange(ir_n) / SR
ir = rng.standard_normal(ir_n) * np.exp(-ir_t * 2.8); ir = lp(ir, 5000); ir /= np.sqrt((ir ** 2).sum())
def verb(x, wet): return x + wet * fftconvolve(x, ir)[:len(x)]

# Sidechain nhẹ cho pad theo kick
duck = np.ones(N)
for b in range(nbars):
    for k in (0, 2):
        t = b * BAR + k * BEAT
        if INTRO <= t < OUTRO:
            i = int(t * SR); n = int(0.3 * SR); j = min(N, i + n)
            duck[i:j] = np.minimum(duck[i:j], 1 - 0.35 * np.exp(-np.arange(j - i) / SR * 10))

mixL = verb(pad * duck, 0.5) + verb(keys, 0.35) + bass + verb(drums, 0.12) + verb(bell, 0.7)
# stereo: lệch keys/bell nhẹ
mixR = mixL.copy()
d = int(0.011 * SR); mixR[d:] = (verb(pad * duck, 0.5) + bass + verb(drums, 0.12))[d:] + (verb(keys, 0.35) + verb(bell, 0.7))[:-d]
mix = np.stack([mixL, mixR], 1)
# fade
fi = int(2.0 * SR); fo = int(4.0 * SR)
mix[:fi] *= np.linspace(0, 1, fi)[:, None]; mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
mix = np.tanh(mix * 1.2) / np.tanh(1.2)
mix /= np.abs(mix).max() / 0.89
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('ok', OUT, DUR)
