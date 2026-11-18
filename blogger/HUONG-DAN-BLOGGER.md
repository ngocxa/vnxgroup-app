# Trang web phần mềm VNXGroup trên Blogger – Hướng dẫn

Website **miễn phí 100%** (Blogger của Google): không mất tiền hosting, có HTTPS, đăng bài bằng trình soạn thảo quen thuộc.

## Thư mục này gồm

| File | Dùng để |
|---|---|
| `vnxgroup-blogger-theme.xml` | Giao diện (theme) – tải lên Blogger 1 lần |
| `mau-bai-san-pham.html` | Mẫu bài giới thiệu phần mềm (hộp thông tin, nút Tải về, ảnh, lịch sử cập nhật) |
| `mau-bai-viet.html` | Mẫu bài hướng dẫn/kiến thức (có khung code, bảng, mẹo) |
| `xem-truoc.png`, `xem-truoc-bai-san-pham.png` | Ảnh xem trước trang chủ và trang bài sản phẩm |

## Bước 1 – Tạo blog (5 phút)
1. Vào **https://www.blogger.com** → đăng nhập Gmail → **Tạo blog mới**.
2. Tên: `VNXGroup Software` (đổi tùy ý). Địa chỉ gợi ý: `vnxgroup-app.blogspot.com` (hoặc tên khác còn trống).

## Bước 2 – Cài giao diện
1. Tải file `vnxgroup-blogger-theme.xml` về máy (trên GitHub: mở file → nút **Download raw file**).
2. Blogger → **Chủ đề** → bấm mũi tên ▾ cạnh nút *Tùy chỉnh* → **Khôi phục** → **Tải lên** → chọn file XML.
3. Nếu Blogger hỏi xóa tiện ích cũ → chọn **Xóa tiện ích**.
4. Ở mục *Chủ đề dành cho thiết bị di động* chọn **Máy tính** (để điện thoại dùng cùng giao diện).

## Bước 3 – Cài đặt cơ bản
- **Cài đặt → Ngôn ngữ và định dạng**: Tiếng Việt, múi giờ GMT+7 (Bangkok/Hà Nội).
- **Cài đặt → Mô tả**: viết 1–2 câu giới thiệu (Google dùng để hiển thị kết quả tìm kiếm).
- **Cài đặt → Bình luận**: chọn *Bất kỳ ai* hoặc *Người dùng có Tài khoản Google*.
- **Bố cục**: chỉnh menu (tiện ích *Menu chính*), sửa hộp *Về VNXGroup*, đổi logo ở *Tiêu đề*.
  Trong *Bài đăng trên Blog* nên đặt **9 bài/trang** cho lưới đẹp.

## Bước 4 – Tạo 2 trang tĩnh (cho menu)
**Trang → Trang mới**:
- `Giới thiệu` → sau khi xuất bản, đường dẫn là `/p/gioi-thieu.html`
- `Liên hệ` → `/p/lien-he.html` (ghi Zalo/email/Facebook)

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
- Thanh bên: tìm kiếm, giới thiệu tác giả + YouTube/Facebook, chủ đề, xem nhiều nhất, lưu trữ.
- Tương thích điện thoại (menu thu gọn), nút lên đầu trang, font Be Vietnam Pro hiển thị tiếng Việt đẹp.

## Tùy chỉnh nhanh (Chủ đề → ▾ → Chỉnh sửa HTML)
- **Màu**: tìm `--navy:#14234b` (màu chính) và `--accent:#f2a516` (màu nhấn).
- **Chữ trên banner**: tìm `Công cụ nhỏ,` và đoạn `<p>Nơi chia sẻ...`.
- **Tên nhãn sản phẩm / số sản phẩm trên trang chủ**: tìm `VNX_CONFIG` ở cuối file.
  Nếu đổi tên nhãn, sửa thêm chữ `Sản phẩm` trong dòng `l.name == &quot;Sản phẩm&quot;`.

## Tên miền riêng (tùy chọn)
Mua tên miền (vd. `vnxgroup.vn`, ~300–500k/năm) → Blogger **Cài đặt → Miền tùy chỉnh** → làm theo hướng dẫn thêm bản ghi CNAME. Không bắt buộc – địa chỉ `.blogspot.com` dùng mãi miễn phí.

## Đưa lên Google
**Cài đặt → Trình thu thập dữ liệu và lập chỉ mục** bật *robots.txt tùy chỉnh* (không bắt buộc), rồi khai báo blog với **Google Search Console** (search.google.com/search-console) và gửi sơ đồ trang `/sitemap.xml`.
