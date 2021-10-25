var ImageManager = {

    //region Preview de imagen
    initPreviewImagen: function () {
        $('.preview_imagen').off("click").on('click', function () {
            var src = $(this).prop('src');
            Swal.fire({
                imageUrl: src,
                imageHeight: '100%',
                showConfirmButton: false,
                showCancelButton: false,
            })
        });
    },
    //endregion

};
