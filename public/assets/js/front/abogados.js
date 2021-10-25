var AbogadosManager = {

    urls: null,

    init: function(urls){
        this.urls = urls;
        this._initEvents();
    },

    _initEvents: function(){
        $('[data-action="loadAbogado"]').off('click').on('click', function () {
            var id = $(this).data('id');
            AbogadosManager.loadAbogado(id);
        });
        //endregion
    },

    loadAbogado: function (id){
        TML.ajax({
            url: AbogadosManager.urls.loadAbogado,
            data: {
                id: id
            },
            lockContainer: true,
            blockmessage: 'Cargando datos de usuario...',
            checkResponse: true,
            callback: function(response){
                TML.fillModalContainer(response);
                $('#modal_abogado').modal({
                    backdrop: 'static',
                    keyboard: false
                })
                $('#modal_abogado').modal('show');
                AbogadosManager.initWizardAbogado();
                FormFielsManager.initLoadImagen();
                AbogadosManager._initEvents();
            }
        });
    },

    saveAbogado: function (steep){
        var form_abogado = $('#form_abogado');
        TML.ajax({
            url: AbogadosManager.urls.saveAbogado,
            data: form_abogado.serialize()+'&steep='+steep,
            lockContainer: true,
            checkResponse: true,
            callback: function(response){

            }
        });
    },

    initWizardAbogado: function (){
        var element = document.querySelector("#wizard_abogado");
        var stepper = new KTStepper(element);
        stepper.on("kt.stepper.next", function (stepper) {
            var steep = stepper.getCurrentStepIndex();
            AbogadosManager.saveAbogado(steep);
            stepper.goNext();

        });
        stepper.on("kt.stepper.previous", function (stepper) {
            var steep = stepper.getCurrentStepIndex();
            AbogadosManager.saveAbogado(steep);
            stepper.goPrevious();
        });
    },
    //endregion
}


