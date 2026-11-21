# Ghép giọng đọc (voice/full.mp3) vào video theo timeline.json, nhạc nền tự hạ khi có giọng
import json,subprocess,os
N=os.path.dirname(os.path.abspath(__file__))
tl=json.load(open(f'{N}/timeline.json')); st=json.load(open(f'{N}/voice/start.json'))
ins=['-i',f'{N}/video_only.mp4','-i',f'{N}/music.wav']; fl=[]; labs=[]
for k,p in enumerate(tl['place']):
    ins+=['-ss',f"{st[p['i']]:.3f}",'-t',f"{p['dur']:.3f}",'-i',f'{N}/voice/full.mp3']
    fl.append(f"[{k+2}:a]aresample=48000,adelay={int(p['at']*1000)}|{int(p['at']*1000)}[v{k}]"); labs.append(f'[v{k}]')
fl.append(''.join(labs)+f"amix=inputs={len(labs)}:normalize=0,volume=1.6[voice]")
fl.append("[voice]apad,asplit[vo][sc]")
fl.append("[1:a]aresample=48000,volume=0.2[mu]")
fl.append("[mu][sc]sidechaincompress=threshold=0.02:ratio=10:attack=20:release=400[duck]")
fl.append("[vo][duck]amix=inputs=2:normalize=0:duration=shortest,loudnorm=I=-16:TP=-1.5:LRA=11[a]")
subprocess.check_call(['ffmpeg','-y','-v','error',*ins,'-filter_complex',';'.join(fl),'-map','0:v','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-shortest','-movflags','+faststart',f'{N}/HuongDan_BangLuong.mp4'])
print('ok')
