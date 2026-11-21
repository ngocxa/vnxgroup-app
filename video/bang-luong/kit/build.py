import json,subprocess,os
N=os.path.dirname(os.path.abspath(__file__))
order=['intro','s01','s02','s03','s04','s05','s06','s07','s08','s09','outro']
F=0.35
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]).decode())
off={};t=0
for n in order:
    meta=json.load(open(f'{N}/frames/{n}/meta.json')); d=meta['tEnd']-meta['t0']; out=f'{N}/clips/{n}.mp4'
    vf=f"fps=30,scale=1920:1080:flags=lanczos,fade=t=in:st=0:d={F},fade=t=out:st={d-F:.3f}:d={F},format=yuv420p"
    subprocess.check_call(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',f'{N}/frames/{n}/list.txt','-vf',vf,'-t',f'{d:.3f}','-c:v','libx264','-preset','medium','-crf','18','-r','30',out])
    d=dur(out); off[n]=[t,d,meta['t0']]; t+=d
open(f'{N}/clips/all.txt','w').write(''.join(f"file '{N}/clips/{n}.mp4'\n" for n in order))
subprocess.check_call(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',f'{N}/clips/all.txt','-c','copy',f'{N}/video_only.mp4'])
L=json.load(open(f'{N}/lines.json')); D=json.load(open(f'{N}/voice/dur.json')); vo=json.load(open(f'{N}/vo.json'))['vo']
place=[]
for v in vo:
    sc=L[v['i']][0]; o,d,t0=off[sc]; place.append({'i':v['i'],'at':round(o+v['t']-t0,3),'dur':D[v['i']]})
place.sort(key=lambda x:x['at']); json.dump({'total':t,'off':off,'place':place},open(f'{N}/timeline.json','w'),indent=1)
def ts(x): h=int(x//3600);m=int(x%3600//60);s=x%60;return f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s-int(s))*1000)):03d}"
srt=[f"{k+1}\n{ts(p['at'])} --> {ts(p['at']+p['dur']+0.3)}\n{L[p['i']][1]}\n" for k,p in enumerate(place)]
open(f'{N}/HuongDan_BangLuong.srt','w',encoding='utf-8').write('\n'.join(srt))
print('TOTAL',round(t,2)); [print(p) for p in place]
