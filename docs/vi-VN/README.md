<div align="center">
  
# ![](../../icons/icon48.png) Webpremium - Trình Tải Trước Liên Kết

</div>

<div align="center">

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MPL--2.0-green.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension-orange.svg)

**Trải Nghiệm Duyệt Web Không Độ Trễ | Tải Trước Thông Minh | Chuyển Đổi Mượt Mà**

[Tính Năng](#-tính-năng) • [Cài Đặt](#-cài-đặt) • [Sử Dụng](#-sử-dụng) • [Cách Hoạt Động](#️-cách-hoạt-động) • [Câu Hỏi Thường Gặp](#-câu-hỏi-thường-gặp)

</div>

---
<p align="center">
  <a href="../en-US/README.md"><img alt="README in English" src="https://img.shields.io/badge/English-d9d9d9"></a>
  <a href="../zh-TW/README.md"><img alt="繁體中文文件" src="https://img.shields.io/badge/繁體中文-d9d9d9"></a>
  <a href="../../README.md"><img alt="简体中文文件" src="https://img.shields.io/badge/简体中文-d9d9d9"></a>
  <a href="../ja-JP/README.md"><img alt="日本語のREADME" src="https://img.shields.io/badge/日本語-d9d9d9"></a>
  <a href="../es-ES/README.md"><img alt="README en Español" src="https://img.shields.io/badge/Español-d9d9d9"></a>
  <a href="../fr-FR/README.md"><img alt="README en Français" src="https://img.shields.io/badge/Français-d9d9d9"></a>
  <a href="../ko-KR/README.md"><img alt="README in Korean" src="https://img.shields.io/badge/한국어-d9d9d9"></a>
  <a href="../ar-SA/README.md"><img alt="README بالعربية" src="https://img.shields.io/badge/العربية-d9d9d9"></a>
  <a href="../tr-TR/README.md"><img alt="Türkçe README" src="https://img.shields.io/badge/Türkçe-d9d9d9"></a>
  <a href="../vi-VN/README.md"><img alt="README Tiếng Việt" src="https://img.shields.io/badge/Ti%E1%BA%BFng%20Vi%E1%BB%87t-d9d9d9"></a>
  <a href="../de-DE/README.md"><img alt="README in Deutsch" src="https://img.shields.io/badge/German-d9d9d9"></a>
  <a href="../bn-BD/README.md"><img alt="README in বাংলা" src="https://img.shields.io/badge/বাংলা-d9d9d9"></a>
</p>

## 📖 Giới Thiệu

Webpremium là một tiện ích mở rộng Chrome mang tính cách mạng, mang lại trải nghiệm duyệt web **không độ trễ** thông qua công nghệ tải trước thông minh. Khi bạn di chuột qua một liên kết, tiện ích sẽ mở trang trước trong cửa sổ tải trước nền. Khi bạn thực sự nhấp vào liên kết, tab đã được tải trước sẽ di chuyển mượt mà đến cửa sổ chính, khiến bạn không cảm thấy bất kỳ thời gian chờ đợi nào.

### ✨ Điểm Nổi Bật

- 🎯 **Trải Nghiệm Không Độ Trễ** - Tải trước khi di chuột, mở ngay khi nhấp
- 🪟 **Công Nghệ Cửa Sổ Tải Trước** - Tải trước trong cửa sổ độc lập, không ảnh hưởng đến cửa sổ chính
- 🔄 **Loại Bỏ Trùng Lặp Tab Thông Minh** - Tự động phát hiện tab trùng lặp và chuyển đến tab hiện có khi nhấp
- 🏠 **Trang Tab-out Mới** - Bảng quản lý tab mới đẹp mắt với yêu thích và tổ chức tab
- 📊 **Thống Kê Thời Gian Thực** - Theo dõi hiệu quả tải trước và thời gian tiết kiệm
- 🎨 **Giao Diện Hiện Đại** - Hỗ trợ chế độ tối, giao diện sạch sẽ và đẹp mắt
- ⚙️ **Tùy Chỉnh Cao** - Tùy chọn cấu hình phong phú để đáp ứng nhu cầu cá nhân
- 🌐 **Hỗ Trợ Đa Ngôn Ngữ** - Hỗ trợ Tiếng Trung giản thể, Tiếng Trung phồn thể, Tiếng Anh và nhiều hơn nữa

---

## 🎯 Tính Năng

### Chức Năng Cốt Lõi

#### 1. Tải Trước Thông Minh
- **Kích Hoạt Bằng Di Chuột** - Tự động tải trước khi di chuột qua liên kết
- **Thời Gian Trễ Có Thể Điều Chỉnh** - Hỗ trợ cấu hình độ trễ di chuột từ 0-1000ms
- **Dự Đoán Liên Kết Gần** - Nhận diện thông minh các liên kết gần con trỏ và tải trước
- **Kiểm Soát Số Lượng Tải Trước** - Có thể đặt số lượng tải trước đồng thời tối đa (1-10)
- **Loại Bỏ Bộ Nhớ Đệm LRU** - Tự động loại bỏ các tải trước ít sử dụng nhất khi vượt quá giới hạn

#### 2. Chế Độ Tải Trước
- **Chế Độ Cửa Sổ Tải Trước (Khuyến Nghị)** - Tải trước trong cửa sổ thu nhỏ độc lập, tải đầy đủ trang, không ảnh hưởng đến cửa sổ chính
- **Chế Độ Tải Trước iframe** - Phương pháp tải trước nhẹ, khả năng tương thích tốt

#### 3. Loại Bỏ Trùng Lặp Tab Thông Minh & Chuyển (Smart Tab Dedup)
- **Phát Hiện Tab Trùng Lặp** - Phát hiện trước khi tải trước xem trang đích đã mở trong cửa sổ hiện tại hay chưa
- **Tự Động Chuyển** - Khi nhấp vào liên kết đã mở, tự động chuyển đến tab hiện có, tránh trùng lặp
- **Bỏ Qua Tải Trước** - Bỏ qua tải trước và chuyển trực tiếp nếu trang đích đã mở
- **Trải Nghiệm Mượt Mà** - Tự động tập trung vào tab và cửa sổ đích

#### 4. Quản Lý Trang Tab-out Mới
- **Trang Tab Mới Đẹp** - Thay thế trang tab mới mặc định bằng bảng quản lý phong phú tính năng
- **Bố Cục Ba Cột** - Yêu thích bên trái, tab đã mở ở giữa, đọc sau bên phải
- **Nhóm Theo Tên Miền** - Tự động nhóm các tab đã mở theo tên miền
- **Chức Năng Yêu Thích** - Yêu thích dài hạn cho các trang web thường xuyên sử dụng với biểu tượng tùy chỉnh
- **Huy Hiệu Số Lượng Tab** - Biểu tượng thanh công cụ hiển thị số tab đang mở hiện tại
- **Phát Hiện Tab Trùng Lặp** - Phát hiện và đề nghị đóng các trang tab mới trùng lặp
- **Hành Động Nhanh** - Đóng tab, ghim, thêm vào yêu thích, v.v. với một lần nhấp
- **Chế Độ Tối** - Hỗ trợ chuyển đổi chủ đề sáng/tối
- **Đa Ngôn Ngữ** - Hỗ trợ chuyển đổi giao diện Tiếng Trung/Tiếng Anh

#### 5. Nhận Biết Mạng
- **Phát Hiện Thông Minh** - Tự động phát hiện trạng thái mạng
- **Chiến Lược Thích Ứng** - Tự động giảm tải trước khi mạng chậm
- **Tiết Kiệm Dữ Liệu** - Tránh lãng phí dữ liệu trong môi trường mạng yếu

#### 6. Tắt Tiếng Khi Tải Trước
- **Tắt Tiếng Mặc Định** - Các tab đã tải trước được tắt tiếng theo mặc định để tránh phát tự động video/phát trực tiếp
- **Bật Tiếng Thủ Công** - Nhấp vào thanh địa chỉ sau khi kích hoạt để bật tiếng

#### 7. Chỉ Báo Trực Quan
- **Hiển Thị Trạng Thái Tải Trước** - Hiển thị chấm nhỏ bên cạnh liên kết để chỉ trạng thái tải trước
- **Hoạt Ảnh Đang Tải** - Chấm màu cam cho biết đang tải
- **Dấu Tải Hoàn Tất** - Chấm màu xanh cho biết tải trước hoàn tất

#### 8. Quản Lý Quy Tắc Trang Web
- **Quy Tắc Tùy Chỉnh** - Bật hoặc tắt tải trước cho các trang web cụ thể
- **Kiểm Soát Cấp Tên Miền** - Kiểm soát tải trước chính xác theo tên miền
- **Menu Ngữ Cảnh** - Nhanh chóng chuyển đổi trạng thái tải trước của trang web hiện tại
- **Quy Tắc Mặc Định** - Tắt tải trước theo mặc định cho các trang web video như Douyin

#### 9. Thống Kê và Phân Tích
- **Số Lần Tải Trước** - Ghi lại tổng số lần tải trước
- **Thống Kê Tỷ Lệ Trúng** - Tính toán tỷ lệ sử dụng hiệu quả của tải trước
- **Thời Gian Tiết Kiệm** - Thống kê tổng thời gian tiết kiệm được
- **Thời Lượng Phiên** - Hiển thị thời lượng sử dụng của phiên hiện tại

### Phím Tắt

- `Alt + P` - Nhanh chóng bật/tắt chức năng tải trước (phải được kích hoạt trong cài đặt)
- `Alt + C` - Xóa tất cả bộ nhớ cache tải trước (phải được kích hoạt trong cài đặt)
- Phím tắt bị tắt theo mặc định để tránh xung đột với hệ thống hoặc các tiện ích mở rộng khác

### Menu Ngữ Cảnh

- **Tải trước liên kết này** - Tải trước thủ công liên kết đã chọn
- **Bật/Tắt tải trước trên trang web này** - Nhanh chóng chuyển đổi trạng thái tải trước của trang web hiện tại
- **Thêm trang vào yêu thích** - Thêm trang hiện tại vào yêu thích Tab-out
- **Thêm liên kết vào yêu thích** - Thêm liên kết vào yêu thích Tab-out

---

## 📦 Cài Đặt

### Phương Pháp 1: Cài Đặt Ở Chế Độ Nhà Phát Triển

1. **Tải mã nguồn**
   Tải từ trang [releases](https://github.com/Yikumasai/Webpremium/releases)
   
   hoặc
   
   ```bash
   git clone https://github.com/Yikumasai/webpremium.git
   ```

2. **Mở trang tiện ích mở rộng Chrome**
   - Nhập `chrome://extensions/` vào thanh địa chỉ
   - Hoặc nhấp vào menu → Công cụ khác → Tiện ích mở rộng

3. **Bật chế độ nhà phát triển**
   - Bật công tắc "Chế độ nhà phát triển" ở góc trên bên phải

4. **Tải tiện ích mở rộng**
   - Nhấp vào "Tải tiện ích đã giải nén"
   - Chọn thư mục `webpremium` đã tải

5. **Hoàn tất cài đặt**
   - Biểu tượng tiện ích sẽ xuất hiện trên thanh công cụ trình duyệt
   - Nhấp vào biểu tượng để mở bảng cài đặt

### Phương Pháp 2: Chrome Web Store
> Sắp ra mắt

---

## 🎮 Sử Dụng

### Sử Dụng Cơ Bản

1. **Bật tiện ích**
   - Sau khi cài đặt, tiện ích được bật mặc định
   - Nhấp vào biểu tượng thanh công cụ để kiểm tra trạng thái

2. **Trải nghiệm tải trước**
   - Di chuột qua bất kỳ liên kết nào
   - Đợi thời gian trễ đã cấu hình (mặc định 100ms)
   - Chấm màu xanh sẽ xuất hiện bên cạnh liên kết khi tải trước hoàn tất
   - Nhấp vào liên kết để mở ngay lập tức

3. **Chuyển Tab Thông Minh**
   - Khi trang đích đã mở trong cửa sổ hiện tại
   - Nhấp vào liên kết tự động chuyển đến tab hiện có
   - Tránh mở cùng một trang hai lần

4. **Xem thống kê**
   - Nhấp vào biểu tượng tiện ích
   - Chuyển sang tab "Thống kê"
   - Xem hiệu quả tải trước và thời gian tiết kiệm

### Trang Tab-out Mới

1. **Bật Tab-out**
   - Mở bảng cài đặt
   - Kích hoạt "Trang Tab-out Mới" trong "Tính năng Nâng cao"
   - Mở một tab mới để xem bảng quản lý

2. **Sử Dụng Yêu Thích**
   - Nhấp vào nút "+" ở góc trên bên trái để thêm yêu thích
   - Nhấp chuột phải vào một tab và chọn "Thêm vào yêu thích"
   - Yêu thích được duy trì để truy cập nhanh

3. **Quản Lý Tab**
   - Cột giữa hiển thị tất cả các tab đã mở (được nhóm theo tên miền)
   - Nhấp vào một tab để chuyển đến trang của nó
   - Nhấp "×" để đóng một tab hoặc toàn bộ nhóm tên miền

### Cài Đặt Nâng Cao

#### Điều Chỉnh Độ Trễ Di Chuột
- Mở bảng cài đặt
- Kéo thanh trượt "Độ trễ di chuột"
- Giá trị khuyến nghị: 100-300ms

#### Đặt Số Lượng Tải Trước
- Mở bảng cài đặt
- Kéo thanh trượt "Số lượng tải trước tối đa"
- Giá trị khuyến nghị: 3-5

#### Chọn Chế Độ Tải Trước
- **Chế Độ Cửa Sổ Tải Trước**: Tải trước đầy đủ, trải nghiệm tốt nhất (khuyến nghị)
- **Chế Độ iframe**: Nhẹ, khả năng tương thích tốt

#### Bật Phím Tắt
- Mở bảng cài đặt
- Bật tùy chọn "Bật phím tắt"
- Sử dụng `Alt+P` để bật/tắt tải trước, `Alt+C` để xóa bộ nhớ cache
- Tùy chỉnh phím tắt trong cài đặt phím tắt Chrome

#### Quản Lý Quy Tắc Trang Web
1. Chuyển sang tab "Quy tắc trang web"
2. Nhấp vào nút "Thêm quy tắc"
3. Nhập tên miền (ví dụ: example.com)
4. Đặt trạng thái bật hoặc tắt

---

## ⚙️ Cách Hoạt Động

### Quy Trình Tải Trước

```
Người dùng di chuột qua liên kết
    ↓
Đợi thời gian trễ
    ↓
Kiểm tra trạng thái mạng
    ↓
Kiểm tra quy tắc trang web
    ↓
Tạo cửa sổ tải trước
    ↓
Mở tab trong cửa sổ tải trước
    ↓
Thu nhỏ cửa sổ tải trước
    ↓
Người dùng nhấp vào liên kết
    ↓
Di chuyển tab đến cửa sổ chính
    ↓
Kích hoạt tab
    ↓
Hoàn tất!
```

### Kiến Trúc Kỹ Thuật

- **Content Script** - Lắng nghe sự kiện liên kết trang, kích hoạt tải trước
- **Background Service Worker** - Quản lý cửa sổ tải trước và tab
- **Popup UI** - Cung cấp giao diện cài đặt và thông tin thống kê
- **Chrome Storage API** - Lưu trữ cài đặt và dữ liệu thống kê

### Công Nghệ Cửa Sổ Tải Trước

Tiện ích sử dụng cửa sổ tải trước độc lập để tải trước trang:

1. Tạo một cửa sổ nhỏ kiểu normal
2. Ngay lập tức thu nhỏ cửa sổ đó
3. Tạo tab tải trước trong cửa sổ
4. Khi người dùng nhấp, di chuyển tab đến cửa sổ chính
5. Kích hoạt tab và tập trung vào cửa sổ chính

Ưu điểm của phương pháp này:
- ✅ Tải trước trang đầy đủ (bao gồm JavaScript, CSS, hình ảnh, v.v.)
- ✅ Cửa sổ chính hoàn toàn không bị ảnh hưởng
- ✅ Tab có thể di chuyển mượt mà
- ✅ Hỗ trợ tất cả các trang web và trang phức tạp

---

## 🎨 Xem Trước Giao Diện

### Bảng Cài Đặt
- Điều khiển công tắc đơn giản
- Điều chỉnh thanh trượt trực quan
- Danh sách tải trước thời gian thực
- Hiển thị liên kết gần

### Bảng Thống Kê
- Tổng số lần tải trước
- Tỷ lệ trúng phần trăm
- Thống kê thời gian tiết kiệm
- Hiển thị thời lượng phiên

### Quy Tắc Trang Web
- Quản lý danh sách tên miền
- Trạng thái bật/tắt
- Thêm/xóa nhanh

---

## 🔧 Tùy Chọn Cấu Hình

| Tùy Chọn | Mô Tả | Giá Trị Mặc Định | Giá Trị Khuyến Nghị |
|------|------|--------|--------|
| Bật tải trước | Công tắc chính | Bật | Bật |
| Độ trễ di chuột | Thời gian sau khi di chuột để kích hoạt tải trước | 100ms | 100-300ms |
| Số lượng tải trước tối đa | Số lượng tải trước đồng thời tối đa | 5 | 3-5 |
| Chế độ tải trước | Phương pháp tải trước | Cửa sổ tải trước | Cửa sổ tải trước |
| Nhận biết mạng | Điều chỉnh theo trạng thái mạng | Bật | Bật |
| Hiển thị chỉ báo | Hiển thị chấm trạng thái tải trước | Bật | Bật |
| Tắt tiếng tải trước | Tắt tiếng tab đã tải trước theo mặc định | Bật | Bật |
| Loại bỏ trùng lặp tab | Phát hiện và chuyển đến tab đã mở | Bật | Bật |
| Trang Tab-out Mới | Bật bảng quản lý | Tắt | Theo nhu cầu |
| Phím tắt | Bật Alt+P / Alt+C | Tắt | Theo nhu cầu |

---

## ❓ Câu Hỏi Thường Gặp

### H: Tải trước có tiêu tốn nhiều dữ liệu không?
Đ: Tiện ích phát hiện thông minh trạng thái mạng và tự động giảm tải trước khi mạng chậm. Bạn cũng có thể kiểm soát tiêu thụ dữ liệu bằng cách điều chỉnh "Số lượng tải trước tối đa".

### H: Tải trước có ảnh hưởng đến hiệu suất trình duyệt không?
Đ: Tải trước sử dụng cửa sổ độc lập, vì vậy tác động đến hiệu suất cửa sổ chính là tối thiểu. Ngoài ra, tiện ích tự động dọn dẹp nội dung tải trước đã hết hạn.

### H: Tại sao tải trước thất bại trên một số trang web?
Đ: Một số trang web có thể có cơ chế bảo vệ. Bạn có thể tắt tải trước cho các trang web này trong "Quy tắc trang web".

### H: Làm thế nào để biết liên kết đã được tải trước?
Đ: Sau khi bật "Hiển thị chỉ báo", chấm màu xanh sẽ xuất hiện bên cạnh các liên kết đã tải trước.

### H: Cửa sổ tải trước có hiển thị không?
Đ: Không. Cửa sổ tải trước được thu nhỏ ngay lập tức và hoàn toàn không ảnh hưởng đến trải nghiệm duyệt web của bạn.

### H: Tôi có thể tắt tải trước cho các trang web cụ thể không?
Đ: Có. Thêm quy tắc tên miền trong tab "Quy tắc trang web", hoặc nhấp chuột phải vào trang và chọn "Bật/Tắt tải trước trên trang web này".

### H: Loại Bỏ Trùng Lặp Tab Thông Minh là gì?
Đ: Khi liên kết mà bạn sắp nhấp đã mở trong cửa sổ hiện tại, tiện ích sẽ tự động chuyển đến tab hiện có thay vì mở một tab mới. Điều này tránh các tab trùng lặp và tiết kiệm bộ nhớ.

### H: Tab-out là gì?
Đ: Tab-out là một bảng quản lý tab mới đẹp hiển thị tất cả các tab đã mở của bạn (được nhóm theo tên miền), yêu thích cho các trang web thường xuyên sử dụng, quản lý đọc sau và nhiều hơn nữa.

### H: Các tab đã tải trước có phát âm thanh không?
Đ: Không. Các tab đã tải trước được tắt tiếng theo mặc định để tránh phát âm thanh tự động từ các trang web video hoặc phát trực tiếp. Sau khi kích hoạt, bạn có thể nhấp vào thanh địa chỉ để bật tiếng.

### H: Tại sao phím tắt của tôi không hoạt động?
Đ: Phím tắt bị tắt theo mặc định và phải được kích hoạt thủ công trong cài đặt. Điều này tránh xung đột với phím tắt hệ thống hoặc các tiện ích mở rộng khác.

---

## 🚀 Lịch Sử Phiên Bản

### v2.1.0 (Phiên Bản Hiện Tại)
- ✨ **Loại Bỏ Trùng Lặp Tab Thông Minh & Chuyển** - Phát hiện trước khi tải trước xem trang đích đã mở trong cửa sổ hiện tại; chuyển đến tab hiện có khi nhấp
- ✨ **Quản Lý Trang Tab-out Mới** - Bảng tab mới đẹp với nhóm theo tên miền, yêu thích và huy hiệu số lượng
- ✨ **Tắt Tiếng Khi Tải Trước** - Các tab đã tải trước được tắt tiếng theo mặc định để tránh phát âm thanh tự động
- ✨ **Phát Hiện Xung Đột Phím Tắt** - Tự động phát hiện và cảnh báo về xung đột phím tắt
- ✨ **Hỗ Trợ Đa Ngôn Ngữ** - Hỗ trợ giao diện Tiếng Trung giản thể, Tiếng Trung phồn thể và Tiếng Anh
- ✨ **Loại Bỏ Bộ Nhớ Đệm LRU** - Tự động loại bỏ nội dung ít sử dụng nhất khi vượt quá giới hạn tải trước
- ✨ **Quy Tắc Trang Web Mặc Định** - Tắt tải trước theo mặc định cho các trang web video như Douyin
- 🔧 Quản lý cửa sổ tải trước được tối ưu hóa với việc tái sử dụng nhiều cửa sổ
- 🔧 Logic theo dõi và dọn dẹp tab được tối ưu hóa

### v2.0.0
- ✨ Công nghệ cửa sổ tải trước mới
- ✨ Quản lý tab thông minh
- ✨ Hệ thống quy tắc trang web
- ✨ Chức năng thống kê và phân tích
- ✨ Tối ưu hóa nhận biết mạng
- ✨ Chỉ báo trực quan
- ✨ Hỗ trợ chế độ tối
- ✨ Hỗ trợ phím tắt
- ✨ Tích hợp menu ngữ cảnh

### v1.4.6
- 🔧 Phát hiện tab trùng lặp
- 🔧 Chức năng tự động chuyển

---

## 🤝 Đóng Góp

Chào đón Issue và Pull Request!



### Cấu Trúc Dự Án

```
webpremium/
├── manifest.json          # Tệp cấu hình tiện ích mở rộng
├── background.js          # Điểm vào script dịch vụ nền
├── content.js             # Điểm vào script nội dung
├── popup.html             # HTML cửa sổ popup
├── popup.js               # Điểm vào script cửa sổ popup
├── popup.css              # Kiểu cửa sổ popup
├── index.html             # HTML trang Tab-out mới
├── app.js                 # Logic trang Tab-out mới
├── style.css              # Kiểu trang Tab-out mới
├── icons/                 # Tệp biểu tượng
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── src/                   # Mã nguồn mô-đun hóa
│   ├── background/        # Mô-đun nền
│   │   ├── preload-window.js   # Quản lý cửa sổ tải trước
│   │   ├── router.js           # Định tuyến tin nhắn
│   │   ├── settings-store.js   # Lưu trữ cài đặt
│   │   ├── site-rules.js       # Quy tắc trang web
│   │   ├── stats.js            # Thống kê
│   │   ├── tab-deduper.js      # Loại bỏ trùng lặp tab
│   │   ├── tab-out.js          # Chức năng Tab-out
│   │   └── tab-tracker.js      # Theo dõi tab
│   ├── content/           # Mô-đun script nội dung
│   │   ├── indicator.js        # Chỉ báo trực quan
│   │   ├── link-tracker.js     # Theo dõi liên kết
│   │   ├── main.js             # Điểm vào chính
│   │   ├── network-aware.js    # Nhận biết mạng
│   │   ├── preloader.js        # Trình tải trước
│   │   └── settings.js         # Quản lý cài đặt
│   ├── popup/             # Mô-đun popup
│   │   ├── api.js              # Bọc API
│   │   ├── dom.js              # Tiện ích DOM
│   │   ├── i18n.js             # Quốc tế hóa
│   │   ├── rules-view.js       # Xem quy tắc
│   │   ├── settings-view.js    # Xem cài đặt
│   │   ├── stats-view.js       # Xem thống kê
│   │   ├── tabs.js             # Chuyển tab
│   │   ├── theme.js            # Chủ đề
│   │   └── toast.js            # Tin nhắn Toast
│   └── shared/            # Mô-đun dùng chung
│       ├── constants.js        # Hằng số
│       ├── logger.js           # Ghi nhật ký
│       └── url-utils.js        # Tiện ích URL
└── README.md              # Tài liệu hướng dẫn
```

---

## 📄 Giấy Phép

Mozilla Public License Version 2.0

Dự án này áp dụng giấy phép MPL-2.0. Để biết chi tiết, vui lòng xem tệp [LICENSE](../../LICENSE).

---

## 💬 Phản Hồi và Hỗ Trợ

- 🐛 [Báo Cáo Lỗi](https://github.com/Yikumasai/webpremium/issues)
- 💡 [Đề Xuất Tính Năng](https://github.com/Yikumasai/webpremium/issues)
- 📧 Email: likanglin2001@qq.com

---

## 🌟 Lời Cảm Ơn

Cảm ơn tất cả người dùng đã sử dụng và hỗ trợ Webpremium!

Nếu dự án này giúp ích cho bạn, hãy cho chúng tôi một ⭐️ Star!

---
## Star History

<a href="https://www.star-history.com/#Yikumasai/Webpremium&type=timeline&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Yikumasai/Webpremium&type=timeline&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Yikumasai/Webpremium&type=timeline&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Yikumasai/Webpremium&type=timeline&legend=top-left" />
 </picture>
</a>

---
<div align="center">

**Duyệt web nhanh hơn, trải nghiệm tốt hơn**

Made with ❤️ by Webpremium

</div>


