$$(document).on('page:init', '.page[data-name="notasDetalles"]', function (e) {
    // alert(servidor);

    $.getJSON(servidor+'api/notasDetalles/get/' + localStorage.getItem("nota_curso") + '/' + localStorage.getItem("alumno"), function (data) {
        console.log(JSON.stringify(data));

        //Si existen datos
        if (typeof data !== 'undefined' && data.length > 0) {
            console.log(data[0].asignatura);
            // the array is defined and has at least one element
            $("#cabecera").empty();
            html = '<tr>';
            html += '<th class="label-cell encabezado">Evaluaciones de la asignatura <br>' + data[0].asignatura + '</th>';
            html += ' <th class="numeric-cell encabezado">Nota</th>';
            html += '</tr>';
            $("#cabecera").append(html);
        }



    })
        .done(function (response) {
            html = '';
            $.each(response, function (index, element) {
                html += '<tr>';
                html += '<td class="label-cell">' + element.evaluacion + '</td>';
                html += '<td class="numeric-cell">' + parseFloat(Math.round(element.nota * 100)/100).toFixed(1)  + '</td>';
                html += '</tr>';

            })
            $("#cuerpo").append(html);
        })
        .fail(function () {
             //Info es cuando guarde el arreglo sin conexión, todavia no lo hago
            if (typeof info == 'undefined' || info == 'null' || info == '[]') {
                app.dialog.alert('Por favor intente nuevamente', 'Sin conexión', function () {
                    app.router.navigate("/inicio/");
                });
            }
        });
})