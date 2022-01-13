$(".custom-file-input").on("change", () => {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

$("#button-change-password").on('click', () => {
    $('.js-modal-change-password').addClass('open');
});

$("#js-close-modal-change-password").on('click', () => {
    $('.js-modal-change-password').removeClass('open');
});

$(".js-modal-change-password").on('click', () => {
    $('.js-modal-change-password').removeClass('open');
});

$("#modal-change-password-form").on('click', (event) => {
    event.stopPropagation();
});

$("#error_change_pass").on('click', () => {
    $("#error_change_pass").empty()
});

$('#js-request-change-password').on('click', (event) => {
    event.preventDefault();

    $.post('/change-password', {
        old_password: $("#old_password").val(),
        password: $('#password_channge').val(),
        re_password: $('#re_password').val(),
        _csrf: $("#csrf_token_change_pass").val()
    }, (data) => {
        console.log(data);
        const alertTemplate = Handlebars.compile(
            document.getElementById("error_template_change_pass").innerHTML
        )
        const alertHTML = alertTemplate(data);
        $("#error_change_pass").empty().prepend(alertHTML);
    }).fail((error) => console.log(error))
})

$('#example5 tbody').on( 'click', '.js-button-accept-reservation', function (event) {
    const currentRow = $(this).closest("tr");
    const id = currentRow.find(".id-reservation-row").html();

    $('#accept-reservation-form-id').val(id);

    $('.js-modal-accept-reservation').addClass('open');
} );

$("#js-close-modal-accept-reservation").on('click', () => {
    $('.js-modal-accept-reservation').removeClass('open');
});

$(".js-modal-accept-reservation").on('click', () => {
    $('.js-modal-accept-reservation').removeClass('open');
});

$("#modal-accept-reservation-form").on('click', (event) => {
    event.stopPropagation();
});