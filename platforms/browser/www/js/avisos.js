//Funcion que detecta cuando se inicia y carga el hmtl "avisos"
$$(document).on('page:init', '.page[data-name="avisos"]', function (e) {

  $(document).ready(function(){
		// $("#mostrar").on( "click", function() {
		// 	$('#target').show(); //muestro mediante id
		// 	$('.target').show(); //muestro mediante clase
		//  });
		$("#target").on( "click", function() {
			$('#target').hide(); //oculto mediante id
			// $('.chip').hide(); //muestro mediante clase
		});
	});


  console.log("entra a avisos");
        $.getJSON('http://localhost:8000/mostrarAviso',function(data){
          console.log(JSON.stringify(data));
        })
        .done(function(response){
          var html;
      
          $.each(response, function(index, element){
            // console.log(index);
            // console.log(element);
            html = '<div class="card">';
            html += '<div class="list">';
            html += '<div class="item-content">';
            html += '<div class="item-media"><img  class="imagen-profesorAnotacion" src="imagenes/'+element.foto_perfil+'.png"/></div>';
            html += '<div class="item-inner">';
            html += '<div class="item-title">'+element.nombre+'</div>';
            html += '<div class="item-after">'+element.fecha+'</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '<div class="card-content card-content-padding"'+element.asunto+'<br>'+element.contenido+'</div>';
            html += '<div class="card-footer"><span class="'+element.asignatura+'">'+element.asignatura+'</span></div>';
            html += '</div>';
            $("#contenido-avisos").append(html);
          })
        });                                
      
})

