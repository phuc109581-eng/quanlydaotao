/* =====================================================
   CẤU HÌNH API
===================================================== */

const API_URL = "/api/students";


/* =====================================================
   BIẾN
===================================================== */

let students = [];

let deleteId = null;


/* =====================================================
   HÀM LẤY ELEMENT
===================================================== */

function $(id) {

    return document.getElementById(id);

}


/* =====================================================
   KHI TRANG ĐƯỢC MỞ
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadStudents();


        /* Nút thêm */

        $("btnAdd").addEventListener(
            "click",
            openAddModal
        );


        /* Nút tìm kiếm */

        $("btnSearch").addEventListener(
            "click",
            searchStudents
        );


        /* Enter trong ô tìm kiếm */

        $("keyword").addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    searchStudents();

                }

            }
        );


        /* Nút làm mới */

        $("btnRefresh").addEventListener(
            "click",
            function () {

                $("keyword").value = "";

                loadStudents();

            }
        );


        /* Đóng form */

        $("btnClose").addEventListener(
            "click",
            closeStudentModal
        );


        $("btnCancel").addEventListener(
            "click",
            closeStudentModal
        );


        $("modalBackground").addEventListener(
            "click",
            closeStudentModal
        );


        /* Submit form */

        $("studentForm").addEventListener(
            "submit",
            saveStudent
        );


        /* Hủy xóa */

        $("btnCancelDelete").addEventListener(
            "click",
            closeDeleteModal
        );


        /* Xác nhận xóa */

        $("btnConfirmDelete").addEventListener(
            "click",
            deleteStudent
        );


        /* Menu */

        $("menuSubject").addEventListener(
            "click",
            function () {

                showToast(
                    "Chức năng Học phần chưa có API."
                );

            }
        );


        $("menuRoom").addEventListener(
            "click",
            function () {

                showToast(
                    "Chức năng Phòng học chưa có API."
                );

            }
        );

    }
);


/* =====================================================
   GET - LẤY DANH SÁCH
===================================================== */

async function loadStudents() {

    try {

        showLoading();


        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Không lấy được danh sách"
            );

        }


        students =
            await response.json();


        renderStudents(students);

    }

    catch (error) {

        console.error(error);

        showError(
            "Không thể kết nối đến Spring Boot."
        );

    }

}


/* =====================================================
   SEARCH - TÌM KIẾM
===================================================== */

async function searchStudents() {

    const keyword =
        $("keyword").value.trim();


    /* Nếu không nhập */

    if (!keyword) {

        loadStudents();

        return;

    }


    try {

        showLoading();


        const url =
            API_URL +
            "?keyword=" +
            encodeURIComponent(keyword);


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Tìm kiếm thất bại"
            );

        }


        students =
            await response.json();


        renderStudents(students);

    }

    catch (error) {

        console.error(error);

        showError(
            "Không thể tìm kiếm sinh viên."
        );

    }

}


/* =====================================================
   HIỂN THỊ LOADING
===================================================== */

function showLoading() {

    $("studentTable").innerHTML = `

        <tr>

            <td
                colspan="7"
                class="loading">

                Đang tải dữ liệu...

            </td>

        </tr>

    `;

}


/* =====================================================
   HIỂN THỊ DANH SÁCH
===================================================== */

function renderStudents(data) {


    if (!data || data.length === 0) {

        $("studentTable").innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty">

                    Không tìm thấy sinh viên.

                </td>

            </tr>

        `;


        $("totalStudents").textContent =
            "Tổng: 0 sinh viên";


        return;

    }


    $("studentTable").innerHTML =
        data.map(
            function (student, index) {

                return `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>


                        <td>

                            <strong>
                                ${escapeHtml(
                                    student.studentCode
                                )}
                            </strong>

                        </td>


                        <td>
                            ${escapeHtml(
                                student.fullName
                            )}
                        </td>


                        <td>
                            ${escapeHtml(
                                student.email
                            )}
                        </td>


                        <td>
                            ${escapeHtml(
                                student.phone || ""
                            )}
                        </td>


                        <td>
                            ${escapeHtml(
                                student.className || ""
                            )}
                        </td>


                        <td>

                            <div
                                class="action-buttons">


                                <button

                                    class="
                                        btn
                                        btn-warning
                                    "

                                    onclick="
                                        openEditModal(
                                            '${student.id}'
                                        )
                                    ">

                                    ✏️ Sửa

                                </button>


                                <button

                                    class="
                                        btn
                                        btn-danger
                                    "

                                    onclick="
                                        openDeleteModal(
                                            '${student.id}'
                                        )
                                    ">

                                    🗑️ Xóa

                                </button>


                            </div>

                        </td>

                    </tr>

                `;

            }
        ).join("");


    $("totalStudents").textContent =
        "Tổng: " +
        data.length +
        " sinh viên";

}


/* =====================================================
   THÊM SINH VIÊN
===================================================== */

function openAddModal() {


    $("modalTitle").textContent =
        "Thêm sinh viên";


    $("studentForm").reset();


    $("studentId").value = "";


    $("studentModal")
        .classList
        .remove("hidden");


    $("studentCode").focus();

}


/* =====================================================
   SỬA SINH VIÊN
===================================================== */

async function openEditModal(id) {


    try {


        const response =
            await fetch(
                API_URL + "/" + id
            );


        if (!response.ok) {

            throw new Error(
                "Không lấy được sinh viên"
            );

        }


        const student =
            await response.json();


        $("modalTitle").textContent =
            "Cập nhật sinh viên";


        $("studentId").value =
            student.id;


        $("studentCode").value =
            student.studentCode || "";


        $("fullName").value =
            student.fullName || "";


        $("email").value =
            student.email || "";


        $("phone").value =
            student.phone || "";


        $("className").value =
            student.className || "";


        $("studentModal")
            .classList
            .remove("hidden");


        $("fullName").focus();


    }

    catch (error) {

        console.error(error);


        showMessage(
            "Không lấy được thông tin sinh viên.",
            "error"
        );

    }

}


/* =====================================================
   POST / PUT
   LƯU SINH VIÊN
===================================================== */

async function saveStudent(event) {


    event.preventDefault();


    const id =
        $("studentId").value;


    const student = {

        studentCode:
            $("studentCode")
                .value
                .trim(),

        fullName:
            $("fullName")
                .value
                .trim(),

        email:
            $("email")
                .value
                .trim(),

        phone:
            $("phone")
                .value
                .trim(),

        className:
            $("className")
                .value
                .trim()

    };


    /* Kiểm tra */

    if (
        !student.studentCode ||
        !student.fullName ||
        !student.email
    ) {

        showMessage(
            "Vui lòng nhập đầy đủ thông tin bắt buộc.",
            "error"
        );

        return;

    }


    const isEdit =
        id !== "";


    const url =
        isEdit
            ? API_URL + "/" + id
            : API_URL;


    const method =
        isEdit
            ? "PUT"
            : "POST";


    try {


        $("btnSave").disabled = true;


        $("btnSave").textContent =
            "Đang lưu...";


        const response =
            await fetch(
                url,
                {

                    method: method,

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(student)

                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Lưu thất bại"
            );

        }


        /* Đóng form */

        closeStudentModal();


        /* Tải lại danh sách */

        await loadStudents();


        /* Thông báo */

        showToast(

            isEdit

                ? "Cập nhật sinh viên thành công!"

                : "Thêm sinh viên thành công!"

        );


    }

    catch (error) {

        console.error(error);


        showMessage(
            "Không thể lưu sinh viên.",
            "error"
        );

    }

    finally {


        $("btnSave").disabled =
            false;


        $("btnSave").textContent =
            "Lưu sinh viên";

    }

}


/* =====================================================
   MỞ XÁC NHẬN XÓA
===================================================== */

function openDeleteModal(id) {


    deleteId = id;


    const student =
        students.find(
            function (item) {

                return String(item.id)
                    === String(id);

            }
        );


    if (student) {

        $("deleteName").textContent =
            student.studentCode +
            " - " +
            student.fullName;

    }


    $("deleteModal")
        .classList
        .remove("hidden");

}


/* =====================================================
   ĐÓNG MODAL XÓA
===================================================== */

function closeDeleteModal() {


    deleteId = null;


    $("deleteModal")
        .classList
        .add("hidden");

}


/* =====================================================
   DELETE
===================================================== */

async function deleteStudent() {


    if (!deleteId) {

        return;

    }


    try {


        $("btnConfirmDelete")
            .disabled = true;


        $("btnConfirmDelete")
            .textContent =
            "Đang xóa...";


        const response =
            await fetch(

                API_URL +
                "/" +
                deleteId,

                {

                    method: "DELETE"

                }

            );


        if (!response.ok) {

            throw new Error(
                "Xóa thất bại"
            );

        }


        closeDeleteModal();


        await loadStudents();


        showToast(
            "Xóa sinh viên thành công!"
        );


    }

    catch (error) {

        console.error(error);


        showMessage(
            "Không thể xóa sinh viên.",
            "error"
        );

    }

    finally {


        $("btnConfirmDelete")
            .disabled = false;


        $("btnConfirmDelete")
            .textContent =
            "Xóa";

    }

}


/* =====================================================
   ĐÓNG MODAL THÊM / SỬA
===================================================== */

function closeStudentModal() {

    $("studentModal")
        .classList
        .add("hidden");

}


/* =====================================================
   HIỂN THỊ LỖI
===================================================== */

function showError(message) {


    $("studentTable").innerHTML = `

        <tr>

            <td
                colspan="7"
                class="empty">

                ${escapeHtml(message)}

            </td>

        </tr>

    `;


    $("totalStudents").textContent =
        "Tổng: 0 sinh viên";

}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    message,
    type
) {


    const box =
        $("message");


    box.textContent =
        message;


    box.className =
        "message " +
        type;


    setTimeout(
        function () {

            box.classList.add(
                "hidden"
            );

        },
        4000
    );

}


/* =====================================================
   TOAST
===================================================== */

let toastTimer;


function showToast(message) {


    const toast =
        $("toast");


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =====================================================
   CHỐNG HTML INJECTION
===================================================== */

function escapeHtml(value) {


    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}