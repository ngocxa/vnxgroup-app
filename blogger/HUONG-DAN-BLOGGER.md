# Trang web VNXGroup Software trên Blogger – Hướng dẫn

Địa chỉ blog: **https://vnxgroupsoftware.blogspot.com/** · YouTube: **https://www.youtube.com/@vnxgroupsoftware** · Zalo/ĐT: **0901 404 453** · Gmail: **vnxgiokinhtoi@gmail.com**

Website **miễn phí 100%** (Blogger của Google): không mất tiền hosting, có HTTPS, đăng bài bằng trình soạn thảo quen thuộc.

## Thư mục này gồm

| File | Dùng để |
|---|---|
| `vnxgroup-blogger-theme.xml` | Giao diện (theme) – tải lên Blogger 1 lần |
| `mau-bai-san-pham.html` | Mẫu bài giới thiệu phần mềm (hộp thông tin, nút Tải về, ảnh, lịch sử cập nhật) |
| `mau-bai-viet.html` | Mẫu bài hướng dẫn/kiến thức (có khung code, bảng, mẹo) |
| `logo/` | Bộ logo VNXGroup: biểu tượng, logo ngang nền tối/sáng (SVG + PNG), favicon |
| `xem-truoc.png`, `xem-truoc-bai-san-pham.png` | Ảnh xem trước trang chủ và trang bài sản phẩm |

## Bước 1 – Tạo blog (5 phút)
1. Vào **https://www.blogger.com** → đăng nhập Gmail → **Tạo blog mới**.
2. Tên: `VNXGroup Software` – địa chỉ: `vnxgroupsoftware.blogspot.com`.

## Bước 2 – Cài giao diện
1. Tải file `vnxgroup-blogger-theme.xml` về máy (trên GitHub: mở file → nút **Download raw file**).
2. Blogger → **Chủ đề** → bấm mũi tên ▾ cạnh nút *Tùy chỉnh* → **Khôi phục** → **Tải lên** → chọn file XML.
3. Nếu Blogger hỏi xóa tiện ích cũ → chọn **Xóa tiện ích**.
4. Ở mục *Chủ đề dành cho thiết bị di động* chọn **Máy tính** (để điện thoại dùng cùng giao diện).

## Logo
Dùng **logo gốc** (chữ G chuyển màu ôm 3 ô V N X) – đã **gắn sẵn trong giao diện** (thanh tiêu đề, hộp tác giả, ảnh thay thế khi bài chưa có ảnh bìa), không cần tải lên.
Chỉ cần thêm **favicon**: **Bố cục → Biểu tượng trang web (Favicon) → Chỉnh sửa** → chọn `logo/favicon.ico`.

| File trong `logo/` | Dùng cho |
|---|---|
| `vnxgroup-logo-goc.png` | Logo gốc nền trong suốt (1024 px) – chèn video, ảnh bìa, slide |
| `vnxgroup-logo-goc-512.png` | Logo gốc cỡ nhỏ (512 px) |
| `vnxgroup-logo-goc-nen-trang.png` | Ảnh đại diện nền trắng – YouTube, Zalo, hồ sơ Blogger |
| `favicon.ico` | Favicon cho Blogger (từ logo gốc) |
| `vnxgroup-mark.svg`, `vnxgroup-logo-nen-*` | Bản vẽ lại trước đây – **không dùng làm logo chính** |

> Khi tải lại giao diện, nếu Blogger hỏi xóa tiện ích *Header1* (tiêu đề cũ) – chọn **Xóa**. Tên hiển thị lấy từ **Cài đặt → Tiêu đề**.
> Hộp **Về VNXGroup Software** ở thanh bên đã có Zalo, Gmail, YouTube. Nếu sau khi tải giao diện mà hộp vẫn hiện nội dung cũ: **Bố cục → Về VNXGroup Software → Chỉnh sửa**, xóa nội dung rồi tải lại giao diện, hoặc dán nội dung mới từ file theme (tìm `author-box`).

### Thấy "Được tạo bởi Blogger", "Báo cáo vi phạm", "Giới thiệu về tôi" ở cuối trang?
Đó là tiện ích của giao diện cũ Blogger giữ lại. Giao diện mới đã tự ẩn chúng. Muốn dọn hẳn: **Bố cục** → tìm các khối *Tiêu đề*, *Ghi nhận tác giả*, *Báo cáo lạm dụng*, *Hồ sơ* → **Chỉnh sửa → Xóa** (khối nào không có nút Xóa thì cứ để, đã được ẩn).

## Bước 3 – Cài đặt cơ bản
- **Cài đặt → Ngôn ngữ và định dạng**: Tiếng Việt, múi giờ GMT+7 (Bangkok/Hà Nội).
- **Cài đặt → Mô tả**: viết 1–2 câu giới thiệu (Google dùng để hiển thị kết quả tìm kiếm).
- **Cài đặt → Bình luận**: chọn *Bất kỳ ai* hoặc *Người dùng có Tài khoản Google*.
- **Bố cục**: chỉnh menu (tiện ích *Menu chính*), sửa hộp *Về VNXGroup*.
  Trong *Bài đăng trên Blog* nên đặt **9 bài/trang** cho lưới đẹp.

## Bước 4 – Tạo 2 trang tĩnh (cho menu)
**Trang → Trang mới**:
- `Giới thiệu` → sau khi xuất bản, đường dẫn là `/p/gioi-thieu.html`
- `Liên hệ` → `/p/lien-he.html` – dán nội dung file `trang-lien-he.html` (Zalo/ĐT 0901 404 453 · Gmail vnxgiokinhtoi@gmail.com · YouTube @vnxgroupsoftware)

> Đặt tiêu đề không dấu trước (`gioi thieu`) → Xuất bản → sửa lại có dấu, để link đẹp đúng như menu.

## Bước 5 – Đăng bài
### Bài giới thiệu phần mềm
1. **Bài đăng mới** → biểu tượng ✏️ góc trái → **Chế độ xem HTML**.
2. Mở `mau-bai-san-pham.html`, chép toàn bộ, dán vào → thay chữ trong `[ ]`.
3. Chuyển về **Chế độ xem soạn thảo** để sửa tiếp như Word, chèn ảnh.
4. Bên phải → **Nhãn**: gõ đúng `Sản phẩm` (có dấu, chữ S hoa) → **Xuất bản**.
   → Bài tự hiện ở lưới *Sản phẩm phần mềm* trên trang chủ, có nhãn vàng "Phần mềm".

### Bài viết thường
Làm tương tự với `mau-bai-viet.html`, gắn nhãn `Bài viết` + nhãn chủ đề (Excel, Kế toán, Android…).

### Mẹo
- **Ảnh đầu tiên** trong bài sẽ thành ảnh bìa của thẻ bài – nên dùng ảnh ngang tỉ lệ 16:9.
- **Link tải phần mềm**: để file trên Google Drive (chia sẻ *Bất kỳ ai có đường liên kết*) hoặc GitHub Releases, ví dụ app Giờ Kinh Tối:
  `https://github.com/ngocxa/vnxgroup-app/releases/latest/download/VNXGroup.apk`
- **Khung code**: ở chế độ HTML dùng `<pre><code>...</code></pre>` – giao diện tự thêm nút *Sao chép*.
- **Video YouTube**: dùng nút chèn video của Blogger hoặc dán mã nhúng.

## Có sẵn trong giao diện
- Trang chủ: banner giới thiệu, lưới sản phẩm (lấy theo nhãn), danh sách bài mới dạng thẻ.
- Trang bài: đường dẫn (breadcrumb), tác giả, ngày, nhãn, nút chia sẻ Facebook/Zalo/Sao chép link, **bài liên quan** tự động, bình luận.
- Thanh bên: tìm kiếm, giới thiệu tác giả + Zalo, Gmail, YouTube, chủ đề, xem nhiều nhất, lưu trữ.
- Tương thích điện thoại (menu thu gọn), nút lên đầu trang, font Be Vietnam Pro hiển thị tiếng Việt đẹp.

## Tùy chỉnh nhanh (Chủ đề → ▾ → Chỉnh sửa HTML)
- **Màu**: tìm `--navy:#14234b` (màu chính) và `--accent:#f2a516` (màu nhấn).
- **Chữ trên banner**: tìm `Công cụ nhỏ,` và đoạn `<p>Nơi chia sẻ...`.
- **3 ô sản phẩm trên banner**: tìm `hero-tile`. Mỗi ô có tên, mô tả ngắn và link (mặc định mở trang tìm kiếm theo tên sản phẩm, vd `search?q=Ch%E1%BA%A5m%20c%C3%B4ng`). Khi đã đăng bài sản phẩm, có thể thay bằng đường dẫn bài, vd `data:blog.homepageUrl + &quot;2026/11/phan-mem-cham-cong-tram-y-te.html&quot;`.
- **Tên nhãn sản phẩm / số sản phẩm trên trang chủ**: tìm `VNX_CONFIG` ở cuối file.
  Nếu đổi tên nhãn, sửa thêm chữ `Sản phẩm` trong dòng `l.name == &quot;Sản phẩm&quot;`.

## Tên miền riêng (tùy chọn)
Mua tên miền (vd. `vnxgroup.vn`, ~300–500k/năm) → Blogger **Cài đặt → Miền tùy chỉnh** → làm theo hướng dẫn thêm bản ghi CNAME. Không bắt buộc – địa chỉ `.blogspot.com` dùng mãi miễn phí.

## Đưa lên Google
**Cài đặt → Trình thu thập dữ liệu và lập chỉ mục** bật *robots.txt tùy chỉnh* (không bắt buộc), rồi khai báo blog với **Google Search Console** (search.google.com/search-console) và gửi sơ đồ trang `/sitemap.xml`.
