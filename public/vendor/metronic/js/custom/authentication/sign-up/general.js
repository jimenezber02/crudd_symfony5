"use strict";

// Class definition
var KTSignUpGeneral = function() {
    // Elements
    var form;
    var submitButton;
    var validator;

    // Handle form
    var handleForm = function(e) {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'toc': {
                        validators: {
                            notEmpty: {
                                message: 'Debe aceptar los Términos y Condiciones'
                            },
                        }
                    },
                    'registration_form[username]': {
                        validators: {
                            notEmpty: {
                                message: 'Se requiere un correo'
                            },
                            emailAddress: {
                                message: 'Dirección de correo inválida'
                            }
                        }
                    },
                    'registration_form[password][first]': {
                        validators: {
                            notEmpty: {
                                message: 'Se requiere una contraseña'
                            }
                        }
                    },
                    'registration_form[password][second]': {
                        validators: {
                            notEmpty: {
                                message: 'Se requiere la confirmación de la contraseña'
                            },
                            identical: {
                                compare: function() {
                                    return form.querySelector('[name="registration_form[password][first]"]').value;
                                },
                                message: 'La contraseña y su confirmación no son lo mismo'
                            }
                        }
                    },
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row'
                    })
                }
            }
        );

        // Handle form submit
        submitButton.addEventListener('click', function (e) {
            // Prevent button default action
            e.preventDefault();

            // Validate form
            validator.validate().then(function (status) {
                if (status == 'Valid') {
                    form.submit();
                }
            });
        });
    }

    // Public functions
    return {
        // Initialization
        init: function() {
            form = document.querySelector('#sign_up_form');
            submitButton = document.querySelector('#sign_up_submit');

            handleForm();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTSignUpGeneral.init();
});
