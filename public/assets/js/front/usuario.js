var UsuarioManager = {

    urls: null,

    init: function(urls){
        this.urls = urls;
        this._initEvents();
    },

    _initEvents: function(){
        $('[data-action="loadUsuario"]').off('click').on('click', function () {
            var id = $(this).data('id');
            UsuarioManager.loadUsuario(id);
        });
    },

    loadUsuario: function (id){
        TML.ajax({
            url: UsuarioManager.urls.loadUsuario,
            data: {
                id: id
            },
            lockContainer: true,
            blockmessage: 'Cargando datos de usuario...',
            checkResponse: true,
            callback: function(response){
                TML.fillModalContainer(response);
                $('#modal_usuario').modal({
                    backdrop: 'static',
                    keyboard: false
                })
                $('#modal_usuario').modal('show');
                UsuarioManager.initWizardUsuario();
                FormFielsManager.initLoadImagen();
                ImageManager.initPreviewImagen();
                UsuarioManager._initEvents();
            }
        });
    },

    saveUsuario: function (steep){
        var form_usuario = new FormData(document.getElementById('form_usuario'));
        form_usuario.append('steep', steep);
        TML.ajax({
            url: UsuarioManager.urls.saveUsuario,
            data: form_usuario,
            lockContainer: false,
            checkResponse: true,
            withFile: true,
            callback: function(response){

            }
        });
    },

    initWizardUsuario: function (){
        var element = document.querySelector("#wizard_usuario");
        var stepper = new KTStepper(element);
        stepper.on("kt.stepper.next", function (stepper) {
            var steep = stepper.getCurrentStepIndex();
            UsuarioManager.saveUsuario(steep);
            stepper.goNext();

        });
        stepper.on("kt.stepper.previous", function (stepper) {
            var steep = stepper.getCurrentStepIndex();
            UsuarioManager.saveUsuario(steep);
            stepper.goPrevious();
        });
    },
}


