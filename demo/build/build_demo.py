#!/usr/bin/env python3
"""Tạo BẢN DÙNG THỬ (demo) cho các phần mềm VNXGroup Software.

Cách dùng:
  python3 build_demo.py <file_cham_cong.html> <file_nd30.html> <file_quan_ly_vien_chuc.html> <thu_muc_ra> [file_bang_luong.html]

Mỗi bản demo:
  - chèn demo-guard.js vào đầu <head>: watermark, chặn In, chặn Xuất Word/Excel/PDF (vẫn cho sao lưu .json);
  - thay tên cơ quan, tên người thật bằng dữ liệu mẫu (Trạm Y tế / Trung tâm Y tế An Bình);
  - nạp sẵn dữ liệu mẫu để người dùng thử thấy kết quả ngay.
File gốc không bị sửa.
"""
import json, os, re, sys, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
GUARD = open(os.path.join(HERE, 'demo-guard.js'), encoding='utf-8').read()
LOGO = open(os.path.join(HERE, 'logo-datauri.txt'), encoding='utf-8').read().strip()


def inject_head(html, app_name, extra_js=''):
    tag = ('<script>window.__VNX_DEMO_APP__=' + json.dumps(app_name, ensure_ascii=False) + ';</script>\n'
           '<script>' + GUARD + '</script>\n' + (('<script>' + extra_js + '</script>\n') if extra_js else ''))
    m = re.search(r'<head[^>]*>', html, re.I)
    assert m, 'không thấy <head>'
    return html[:m.end()] + '\n' + tag + html[m.end():]


def must_replace(s, old, new, count=None):
    n = s.count(old)
    assert n, 'không thấy: ' + old[:60]
    if count is not None:
        assert n == count, f'{old[:50]}: {n} lần (cần {count})'
    return s.replace(old, new)


# ---------------- Chấm công Trạm Y tế (bản trực tuyến → chạy trên máy, không cần máy chủ) ----------------
CC_SEED = {"khoa": ["Trạm Y tế xã An Bình"], "nv": [
    ["Nguyễn Văn An", "Trạm Y tế xã An Bình", "NS", "Lao", "chính"], ["Trần Thị Bình", "Trạm Y tế xã An Bình", "NS", "Phong", "chính"],
    ["Lê Hoàng Cường", "Trạm Y tế xã An Bình", "NS", "Tâm thần", "2"], ["Phạm Thị Dung", "Trạm Y tế xã An Bình", "NS", "", "2"],
    ["Võ Minh Đức", "Trạm Y tế xã An Bình", "NS", "", "3"], ["Huỳnh Thị Hoa", "Trạm Y tế xã An Bình", "NS", "", "3"],
    ["Đặng Thị Lan", "Trạm Y tế xã An Bình", "NS", "", "chính"], ["Bùi Văn Khang", "Trạm Y tế xã An Bình", "NS", "", "chính"]],
    "cfg": {"donvi": "UBND XÃ AN BÌNH", "noiKy": "An Bình", "gdChuc": "TRƯỞNG TRẠM", "gdTen": "Nguyễn Văn An", "ktChuc": "KẾ TOÁN", "ktTen": "Trần Thị Bình",
            "ctList": "Lao, Phong, Tâm thần", "csList": "chính, 2, 3", "tenIn": "TRẠM Y TẾ",
            "bangPhu": [{"noi": "Trung tâm Y tế khu vực", "km": 18.5, "kx": "", "kpc": ""}, {"noi": "TYT xã Bình Phước", "km": 12, "kx": "", "kpc": ""}],
            "ctHS": 0.4, "ctMax": 22}, "khoaInfo": {}, "brand": "Trạm Y tế xã An Bình", "ct": 1}


def build_cc(src):
    s = open(src, encoding='utf-8').read()
    s = re.sub(r'^const SEED = .*;$', lambda m: 'const SEED = ' + json.dumps(CC_SEED, ensure_ascii=False) + ';', s, count=1, flags=re.M)
    for old, new in [
        ("BVĐKKV Nguyễn Văn Thủ", "Bản dùng thử"),
        ("logo Bệnh viện ĐKKV Nguyễn Văn Thủ", "logo VNXGroup Software"),
        ("'BỆNH VIỆN ĐA KHOA KHU VỰC NGUYỄN VĂN THỦ'", "'TRUNG TÂM Y TẾ KHU VỰC AN BÌNH'"),
        ("'BSCKII. Lâm Văn Dũng'", "'Nguyễn Văn An'"), ("noiKy:'Vĩnh Long'", "noiKy:'An Bình'"),
        ("'Lý Văn Ngoạn'", "'Trần Thị Bình'"), ("'Huỳnh Thanh Xuân'", "'Lê Hoàng Cường'"),
        ("'Biện Thị Hồng Cúc'", "'Phạm Thị Dung'"), ("'Huỳnh Thị Bích Liên'", "'Võ Minh Đức'"),
        ("'Lê Thanh Tùng'", "'Huỳnh Thị Hoa'"), ("'Cao Mỹ Thuy'", "'Bùi Văn Khang'"),
        ("Bệnh viện Đa khoa khu vực Nguyễn Văn Thủ", "Trạm Y tế xã An Bình"),
    ]:
        s = must_replace(s, old, new)
    # danh sách thứ tự người trong defaults(): bỏ tên tác giả khỏi danh sách nhân viên mẫu
    s = must_replace(s, "'Huỳnh Thị Hoa','Võ Ngọc Xa','Bùi Văn Khang'", "'Huỳnh Thị Hoa','Đặng Thị Lan','Bùi Văn Khang'", 1)
    s = re.sub(r"const LOGO_BV='data:image/[^']*'", lambda m: "const LOGO_BV='" + LOGO + "'", s, count=1)
    # bỏ màn hình đăng nhập máy chủ, chạy thẳng bản trên máy
    boot = ("<script>(function(){var l=document.getElementById('olLogin');if(l)l.style.display='none';"
            "var m=document.getElementById('appMain');if(m&&!window.__BOOT__){var s=document.createElement('script');s.textContent=m.textContent;document.body.appendChild(s)}"
            "setTimeout(function(){if(l)l.remove()},300)})();</script>\n")
    i = s.rfind('</body>'); assert i > 0
    s = s[:i] + boot + s[i:]
    return inject_head(s, 'Chấm công Trạm Y tế')


# ---------------- Soạn thảo văn bản NĐ30 ----------------
ND_ORG = {"coQuanChuQuan": "UBND XÃ AN BÌNH", "coQuanBanHanh": "TRẠM Y TẾ XÃ AN BÌNH", "vietTat": "TYT", "donVi": "", "diaDanh": "An Bình", "thuTruong": "TRƯỞNG TRẠM"}
ND_FIX = r"""
(function(){
  try{ if(!localStorage.getItem('nd30_org')) localStorage.setItem('nd30_org', %s) }catch(e){}
  var MAP=[[/BỆNH VIỆN ĐA KHOA KHU VỰC NGUYỄN VĂN THỦ/g,'TRUNG TÂM Y TẾ KHU VỰC AN BÌNH'],[/Bệnh viện Đa khoa khu vực Nguyễn Văn Thủ/gi,'Trung tâm Y tế khu vực An Bình'],
           [/BỆNH VIỆN ĐA KHOA KHU VỰC\s*\n\s*NGUYỄN VĂN THỦ/g,'TRUNG TÂM Y TẾ\nKHU VỰC AN BÌNH'],[/SỞ Y TẾ TỈNH VĨNH LONG/g,'SỞ Y TẾ TỈNH AN BÌNH'],[/Sở Y tế tỉnh Vĩnh Long/g,'Sở Y tế tỉnh An Bình']];
  function fix(v){ if(typeof v!=='string') return v; for(var i=0;i<MAP.length;i++) v=v.replace(MAP[i][0],MAP[i][1]); return v }
  [HTMLTextAreaElement,HTMLInputElement].forEach(function(C){ var d=Object.getOwnPropertyDescriptor(C.prototype,'value');
    Object.defineProperty(C.prototype,'value',{get:d.get,set:function(v){d.set.call(this,fix(v))},configurable:true}) });
  function walk(n){ if(n.nodeType===3){ var f=fix(n.nodeValue); if(f!==n.nodeValue) n.nodeValue=f } else if(n.childNodes) for(var i=0;i<n.childNodes.length;i++) walk(n.childNodes[i]) }
  new MutationObserver(function(ms){ ms.forEach(function(m){ if(m.type==='characterData') walk(m.target); else m.addedNodes.forEach(walk) }) })
    .observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  document.addEventListener('DOMContentLoaded',function(){ walk(document.body) });
})();
""" % json.dumps(json.dumps(ND_ORG, ensure_ascii=False), ensure_ascii=False)


def build_nd(src):
    s = open(src, encoding='utf-8').read()
    return inject_head(s, 'Soạn thảo văn bản NĐ30', ND_FIX)


# ---------------- Quản lý viên chức ----------------
def build_vc(src, seed_json):
    s = open(src, encoding='utf-8').read()
    for old, new in [
        ("capTren:'SỞ Y TẾ TỈNH VĨNH LONG',donVi1:'BỆNH VIỆN ĐA KHOA KHU VỰC',donVi2:'NGUYỄN VĂN THỦ',diaDanh:'Vĩnh Long'",
         "capTren:'SỞ Y TẾ TỈNH AN BÌNH',donVi1:'TRUNG TÂM Y TẾ',donVi2:'KHU VỰC AN BÌNH',diaDanh:'An Bình'"),
        ('placeholder="VD: Trạm Y tế xã Trung Thành"', 'placeholder="VD: Trạm Y tế xã An Bình"'),
        ("/TTr-BVĐK, ngày", "/TTr-TTYT, ngày"), ("của BVĐK khu vực Nguyễn Văn Thủ)", "của Trung tâm Y tế khu vực An Bình)"),
    ]:
        s = must_replace(s, old, new)
    seed = json.loads(seed_json); seed['S']['logo'] = LOGO
    pre = ("try{if(!localStorage.getItem('qlvc_nvt_v1')){localStorage.setItem('qlvc_nvt_v1'," + json.dumps(json.dumps(seed, ensure_ascii=False), ensure_ascii=False) +
           ");localStorage.setItem('qlvc_seen','1')}}catch(e){}")
    return inject_head(s, 'Quản lý viên chức', pre)


# ---------------- Bảng lương viên chức ----------------
def build_bl(src, seed_json):
    s = open(src, encoding='utf-8').read()
    s = re.sub(r'const LOGO_BV = "data:image/[^"]*"', lambda m: 'const LOGO_BV = "' + LOGO + '"', s, count=1)
    for old, new in [
        ('coQuan: "SỞ Y TẾ TỈNH VĨNH LONG", donVi1: "BỆNH VIỆN ĐA KHOA KHU VỰC", donVi2: "NGUYỄN VĂN THỦ"',
         'coQuan: "SỞ Y TẾ TỈNH AN BÌNH", donVi1: "TRUNG TÂM Y TẾ", donVi2: "KHU VỰC AN BÌNH"'),
        ('diaDanh: "Trung Thành"', 'diaDanh: "An Bình"'),
        ('donViNgan: "BVĐK khu vực Nguyễn Văn Thủ"', 'donViNgan: "TTYT khu vực An Bình"'),
        ('"BỆNH VIỆN ĐA KHOA KHU VỰC NGUYỄN VĂN THỦ"', '"TRUNG TÂM Y TẾ KHU VỰC AN BÌNH"'),
        (' (logo bệnh viện chỉ dùng cho BVĐK khu vực Nguyễn Văn Thủ)', ''),
    ]:
        s = must_replace(s, old, new)
    s = s.replace('Nguyễn Văn Thủ', 'An Bình').replace('NGUYỄN VĂN THỦ', 'AN BÌNH')
    seed = json.loads(seed_json); seed['settings']['logo'] = LOGO
    key = f"{seed['settings']['nam']}-{seed['settings']['thang']:02d}"
    pre = ("try{if(!localStorage.getItem('bangluong.periods.v1')){localStorage.setItem('bangluong.periods.v1'," +
           json.dumps(json.dumps({key: seed}, ensure_ascii=False), ensure_ascii=False) + ");localStorage.setItem('bangluong.cur','" + key + "')}}catch(e){}")
    return inject_head(s, 'Bảng lương viên chức', pre)


README = """VNXGroup Software – BẢN DÙNG THỬ: {app}
========================================================

1. Giải nén file .zip này.
2. Bấm đúp file {file} – phần mềm mở bằng Chrome hoặc Edge (không cần cài đặt).
3. Đã có sẵn dữ liệu mẫu (tên giả) để bạn xem kết quả ngay; có thể nhập dữ liệu của đơn vị mình.

Giới hạn của bản dùng thử:
  - Có chữ "BẢN DÙNG THỬ" phủ trên màn hình.
  - Không In, không Xuất file Word / Excel / PDF.
  - Vẫn sao lưu dữ liệu được (.json) để chuyển sang bản đầy đủ.

Nhận bản đầy đủ, mã kích hoạt và hướng dẫn cài đặt:
  Tác giả : Võ Ngọc Xa – VNXGroup Software
  Zalo/ĐT : 0901 404 453
  Gmail   : vnxgiokinhtoi@gmail.com
  Blog    : https://vnxgroupsoftware.blogspot.com/
  YouTube : https://www.youtube.com/@vnxgroupsoftware

© 2026 VNXGroup Software · Võ Ngọc Xa. Bản quyền thuộc tác giả.
"""


def pack(out_dir, base, app, html):
    os.makedirs(out_dir, exist_ok=True)
    hp = os.path.join(out_dir, base + '.html')
    open(hp, 'w', encoding='utf-8').write(html)
    zp = os.path.join(out_dir, base + '.zip')
    with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        z.write(hp, base + '.html')
        z.writestr('HUONG-DAN-DUNG-THU.txt', README.format(app=app, file=base + '.html'))
    print(base, round(os.path.getsize(hp) / 1024), 'KB html →', round(os.path.getsize(zp) / 1024), 'KB zip')


if __name__ == '__main__':
    cc, nd, vc, out = sys.argv[1:5]
    bl = sys.argv[5] if len(sys.argv) > 5 else None
    seed = open(os.path.join(HERE, 'seed-quan-ly-vien-chuc.json'), encoding='utf-8').read()
    pack(out, 'ChamCong_TramYTe_DungThu', 'Chấm công Trạm Y tế', build_cc(cc))
    pack(out, 'SoanThao_ND30_DungThu', 'Soạn thảo văn bản NĐ30', build_nd(nd))
    pack(out, 'QuanLyVienChuc_DungThu', 'Quản lý viên chức', build_vc(vc, seed))
    if bl:
        pack(out, 'BangLuong_DungThu', 'Bảng lương viên chức', build_bl(bl, open(os.path.join(HERE, 'seed-bang-luong.json'), encoding='utf-8').read()))
