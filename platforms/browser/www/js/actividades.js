//Funcion que detecta cuando se inicia y carga el hmtl "actividades"

$$(document).on('page:init', '.page[data-name="actividades"]', function (e) {
    // alert(servidor);
    // alert(localStorage.getItem("alumno"));
    $.getJSON(servidor+'/api/actividades/get/' + localStorage.getItem("alumno"), function (data) {
    })
        .done(function (response) {
            var html;
            var info = '[';
            $.each(response, function (index, element) {
                //Separa la fecha de inicio con la hora
                var finicio = element.start,
                    separador = " ",
                    arregloFInicio = finicio.split(separador);
                var fecha_inicio = arregloFInicio[0];
                var hora_inicio = arregloFInicio[1];


                //Separa la fecha de fin con la hora
                var ffin = element.end,
                    arregloFFIN = ffin.split(separador);
                var fecha_fin = arregloFFIN[0];
                var hora_fin = arregloFFIN[1];


                //Crear formato del JSON
                if (index != 0) {
                    info += ',';
                }
                info += '{' + JSON.stringify('from') + ':' + JSON.stringify(fecha_inicio) + ',';
                info += JSON.stringify('title') + ':' + JSON.stringify(element.title) + ',';
                info += JSON.stringify('to') + ':' + JSON.stringify(element.end) + ',';
                info += JSON.stringify('horaInicio') + ':' + JSON.stringify(hora_inicio) + ',';
                info += JSON.stringify('horaFin') + ':' + JSON.stringify(hora_fin) + ',';
                info += JSON.stringify('descripcion') + ':' + JSON.stringify(element.descripcion) + ',';
                info += JSON.stringify('profesor') + ':' + JSON.stringify(element.profesor) + ',';
                info += JSON.stringify('asignatura') + ':' + JSON.stringify(element.asignatura) + ',';
                info += JSON.stringify('color_asignatura') + ':' + JSON.stringify(element.backgroundColor) + ',';
                info += JSON.stringify('tipo_actividad') + ':' + JSON.stringify(element.tipo_actividad) + ',';
                info += JSON.stringify('color') + ':' + JSON.stringify(element.backgroundColor) + '}';
            })

            info += ']';
            localStorage.setItem("info_actividades", info);
            var json = JSON.parse(localStorage.getItem("info_actividades"));
            calendario(json);
        })
        .fail(function () {
            var info = localStorage.getItem("info_actividades")
            // console.log("info",info);
            if (typeof info == 'undefined' || info == 'null' || info == '[]') {
                intentardenuevo.dialog.alert("Se produjo un error de red desconocido", "Error de conexión", function () {
                    app.router.navigate("/inicio/");
                });

            }
            var json = JSON.parse(info);
            calendario(json);
        });

    //Calendario
    function calendario(json) {
        var $$ = Dom7;
        var monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        var calendarInline = app.calendar.create({
            containerEl: '#demo-calendar-inline-container',
            value: [new Date()],
            weekHeader: true,
            dayNamesShort: ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'],
            events: json,

            formatValue: function (inputEl) {
                var arr = [];
                for (var i = 0; i < inputEl.length; i++) {
                    var d = new Date(inputEl[i]);
                    d.setDate(d.getDate());
                    arr.push(d.toISOString().slice(0, 10));
                }
                return arr;
            },

            renderToolbar: function () {
                return '<div class="toolbar calendar-custom-toolbar no-shadow">' +
                    '<div class="toolbar-inner">' +
                    '<div class="left">' +
                    '<a href="#" class="link icon-only"><i class="icon icon-back ' + (app.theme === 'md' ? 'color-black' : '') + '"></i></a>' +
                    '</div>' +
                    '<div class="center"></div>' +
                    '<div class="right">' +
                    '<a href="#" class="link icon-only"><i class="icon icon-forward ' + (app.theme === 'md' ? 'color-black' : '') + '"></i></a>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            },
            on: {
                init: function (c) {
                    $$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
                    $$('.calendar-custom-toolbar .left .link').on('click', function () {
                        calendarInline.prevMonth();
                    });
                    $$('.calendar-custom-toolbar .right .link').on('click', function () {
                        calendarInline.nextMonth();
                    });
                },
                monthYearChangeStart: function (c) {
                    $$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
                },

                change: function (c, inputEl) {
                    $(".contenido").empty();
                    html = '<li class="item-content">';
                    html += '<center>Sin actividades</center>';
                    html += '</li>';
                    $(".contenido").append(html);

                    var detalles = [];
                    var count = 0;



                    arrFechaClic = c.params.formatValue(inputEl);
                    fechaClic = arrFechaClic[0];
                    arregloFClicSeparada = fechaClic.split('-');
                    var anioClic = parseInt(arregloFClicSeparada[0]);
                    var mesClic = parseInt(arregloFClicSeparada[1]);
                    var diaClic = parseInt(arregloFClicSeparada[2]);
                    for (var i in json) {
                        var fechaI = JSON.stringify(json[i].from);
                        arrfechaInicioSeparada = fechaI.split('-');
                        var anioInicio = parseInt((arrfechaInicioSeparada[0]).substring(1));
                        var mesInicio = parseInt(arrfechaInicioSeparada[1]);
                        var diaInicio = parseInt(arrfechaInicioSeparada[2]);

                        var fechaF = JSON.stringify(json[i].to);
                        arrfechaFinSeparada = fechaF.split('-');
                        var anioFin = parseInt((arrfechaFinSeparada[0]).substring(1));
                        var mesFin = parseInt(arrfechaFinSeparada[1]);
                        var diaFin = parseInt(arrfechaFinSeparada[2]);


                        if (diaClic >= diaInicio && diaClic <= diaFin
                            && mesClic >= mesInicio && mesClic <= mesFin
                            && anioClic >= anioInicio && anioClic <= anioFin) {


                            count++;
                            if (count < 2) {
                                $(".contenido").empty();
                            }
                            //Al hacer click en una fecha
                            html = '<li id=li' + count + ' class="item-content sheet-open data-sheet" data-sheet=".my-sheet">';
                            html += '<div class="item-media">' + (JSON.stringify(json[i].horaInicio)).slice(1, -4) + ' - ' + (JSON.stringify(json[i].horaFin)).slice(1, -4) + '</div>';
                            html += '<div class="item-inner">';
                            html += '<div class="item-title-row">';
                            html += '<div class="item-title">' + (JSON.stringify(json[i].title)).slice(1, -1) + '</div>';
                            html += '</div>';
                            html += '<div class="item-subtitle">';
                            html += '<span class="'+ (JSON.stringify(json[i].asignatura)).charAt(1).toUpperCase() +'ovalo">';
                            html += (JSON.stringify(json[i].asignatura)).slice(1, -1) + '</span>'
                            html += '</div>';
                            html += '</li>';
                            $(".contenido").append(html);


                            //Contenido del modal
                            var html = '';
                            html += '<div id="modal' + count + '">';
                            html += '<div class="toolbar">';
                            html += '<div class="toolbar-inner">';
                            html += '<div class="left tituloActividad"> &nbsp;&nbsp;' + (JSON.stringify(json[i].title)).slice(1, -1) + '</div>';
                            html += '<div class="right"><a class="link sheet-close" href="#">X</a></div>';
                            html += '</div>';
                            html += '</div>';

                            html += '<div class="sheet-modal-inner">';
                            html += '<div class="content-modal">';
                            if (diaInicio == diaFin && mesInicio == mesFin && anioInicio == anioFin) {
                                html += '<div class="letraFecha">El ' + diaInicio + ' de ' + monthNames[mesInicio - 1] + ' desde las '
                                    + (JSON.stringify(json[i].horaInicio)).slice(1, -4) + ' hasta las ' + (JSON.stringify(json[i].horaFin)).slice(1, -4) + ' hrs</div>';
                            } else {
                                html += '<div class="letraFecha">Del ' + diaInicio + ' de ' + monthNames[mesInicio - 1] + ' a las  ' + (JSON.stringify(json[i].horaInicio)).slice(1, -4)
                                    + ' al ' + diaFin + ' de ' + monthNames[mesFin - 1] + ' a las  ' + (JSON.stringify(json[i].horaFin)).slice(1, -4) + '</div>';
                            }
                            html += '<div class="date titulos">Descripción:</div>';
                            if ($.isEmptyObject(json[i].descripcion)) {
                                html += '<t>Sin descripción</t>';
                            } else {
                                html += '<t>' + (JSON.stringify(json[i].descripcion)).slice(1, -1) + '</t>';
                            }
                            html += '<br><div> <span style="float: right; " class="letraFecha"> Prof: ' + (JSON.stringify(json[i].profesor)).slice(1, -1) + '</span>'
                            html += '</div>';
                            html += '<br><div class="card-footer">';

                            html += '<span style="margin-right: 10px; padding: 3px; padding-left: 10px; padding-right: 10px; font-weight: bold; color: #ffffff; background-color:' + (JSON.stringify(json[i].color)).slice(1, -1) + '; border-radius: 15px; ">';
                            html += (JSON.stringify(json[i].tipo_actividad)).slice(1, -1) + '</span>';

                            html += '<span class="'+ (JSON.stringify(json[i].asignatura)).charAt(1).toUpperCase() +'ovalo">';
                            html += (JSON.stringify(json[i].asignatura)).slice(1, -1) + '</span>';


                            
                            html += '</div>';
                            html += '</div>';
                            html += '</div>';
                            html += '</div>';
                            detalles.push(html);
                        }
                    }
                    $('.my-sheet').on('sheet:open', function (e, sheet) {
                    });

                    for (i = 0; i <= count; i++) {
                        clickEnActividad(i);
                    }

                    function clickEnActividad(i) {
                        $("#li" + i).click(function () {
                            $("#modal").empty();
                            $("#modal").append(detalles[i - 1]);
                        });
                    }
                }
            }
        });
    }
})
