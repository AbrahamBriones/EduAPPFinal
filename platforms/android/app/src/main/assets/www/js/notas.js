//Funcion que detecta cuando se inicia y carga el hmtl "notas"
$$(document).on('page:init', '.page[data-name="notas"]', function (e) {
  var hoy = new Date();
  var yyyy = hoy.getFullYear();
  var mm = hoy.getMonth() + 1;
  if (mm < 10) {
    mm = '0' + mm;
  }
  var semestreActual = Math.floor((mm - 1) / 6) + 1;
  // alert(semestreActual);
  if (semestreActual == 1) {
    var html_select = '<option value="1" selected> Semestre 1 </option>';
    html_select += '<option value="2">Semestre 2</option>';
  } else {

    var html_select = '<option value="1"> Semestre 1 </option>';
    html_select += '<option value="2" selected>Semestre 2</option>';
  }
  $("#select-semestres").empty();
  $("#select-semestres").append(html_select);
  $('#anyo').val(yyyy);
  obtenerNotas(semestreActual, yyyy);

  $(function () {
    $('#anyo').on('change', onAnyoChange);
    $('#select-semestres').on('change', onSelectSemestresChange);
  });

  function onSelectSemestresChange() {
    semestreActual = $(this).val();
    // alert(semestre_id);
    // console.log(semestreActual, yyyy);
    obtenerNotas(semestreActual, yyyy);
  }

  function onAnyoChange() {
    yyyy = $(this).val();
    // alert(semestre_id);
    // console.log(semestreActual, yyyy);
    obtenerNotas(semestreActual, yyyy);
  }


  function obtenerNotas(semestre, anyo) {
    $("#resumenNotas").empty();
    $.getJSON(servidor+'api/notas/get/' + localStorage.getItem("alumno") + '/' + semestre + '/' + anyo, function (data) {
      // console.log(JSON.stringify(data));
      if (JSON.stringify(data) == '[]') {
        // app.dialog.alert('No existen evaluaciones en el período seleccionado', 'Sin registros', function () {
        // });
        
        $("#resumenNotas").append('<li class="item-content">No existen evaluaciones en el período seleccionado</li>');
      }
    })
      .done(function (response) {
        var html = '';
        $.each(response, function (index, element) {

          var nombresProfesor = element.profesor.split(' ');
          html += '<ul>';
          html += '<li>';
          html += '<a href="' + element.id_curso + '" class="item-link item-content" id="detalle">';
          html += '<div class="item-media"><h2><span class="'+element.asignatura.charAt(0).toUpperCase()+'circulo">' + element.asignatura.charAt(0) + '</span></h2></div>';
          html += '<div class="item-inner">';
          html += '<div class="item-title" id="asignatura">' + element.asignatura;
          html += '<div class="item-text">Prof: ' + nombresProfesor[0] + '</div>';
          html += '</div>';
          html += '<div>';
          html += '<div class="item-header">';
          html += '<div class="letraPromedio">PROMEDIO</div>';
          html += '</div>';
          html += '<div class="letraNota">' + parseFloat(Math.round(element.promedio * 100)/100).toFixed(1) + '</div>';
          html += '</div>';
          html += '</div>';
          html += '</a>';
          html += '</li>';
          html += '</ul>';
          // console.log(html)

        })
        // html += '</div>';
        $("#resumenNotas").append(html);
      })
      .fail(function () {
        //Info es cuando guarde el arreglo sin conexión, todavia no lo hago
        if (typeof info == 'undefined' || info == 'null' || info == '[]') {
          app.dialog.alert('Por favor intente nuevamente', 'Sin conexión', function () {
            app.router.navigate("/inicio/");
          });
        }
      });
  }




})




$(document).on('click', '#detalle', function () {
  var id_curso = $(this).attr('href');
  localStorage.setItem("nota_curso", id_curso);
  app.router.navigate("/notasDetalles/");
});


//   13.382.110-4
//17641297-6