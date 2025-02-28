$(document).ready(function() {
    var currentMesa = null; // Almacena la mesa que se está reservando
  
    // Al hacer clic en "Reservar" en cualquier mesa, mostramos el modal.
    $('.reservar-btn').click(function() {
      currentMesa = $(this).closest('.mesa');
      $('#reservationName').val(''); // Limpiar el campo de entrada
      $('#reservationModal').fadeIn();
    });
  
    // Cerrar el modal al pulsar la "X"
    $('.modal .close').click(function() {
      $('#reservationModal').fadeOut();
    });
  
    // Si se pulsa fuera del contenido del modal, se cierra el modal.
    $(window).click(function(event) {
      if ($(event.target).is('#reservationModal')) {
        $('#reservationModal').fadeOut();
      }
    });
  
    // Al confirmar la reserva en el modal
    $('#confirmReservation').click(function() {
      var name = $('#reservationName').val().trim();
      if(name === '') {
        alert("Por favor, introduce un nombre para la reserva.");
        return;
      }
      
      // Actualizar el estado de la mesa a "Ocupada"
      currentMesa.find('p').text("Estado: Ocupada");
      // Deshabilitar el botón para evitar nuevas reservas en la misma mesa
      currentMesa.find('.reservar-btn').prop('disabled', true).text("Reservada");
      
      // Obtener el número de la mesa (del <h3>)
      var mesaNumber = currentMesa.find('h3').text();
      // Agregar la reserva al listado de asignaciones
      $('.divAsignadas').append('<p>' + mesaNumber + ' - ' + name + '</p>');
      
      // Actualizar los contadores de mesas libres y ocupadas
      actualizarResumen();
      
      // Cerrar el modal
      $('#reservationModal').fadeOut();
    });
  
    // Función para actualizar el resumen de mesas
    function actualizarResumen() {
      var totalMesas = $('.mesa').length;
      var ocupadas = $('.mesa').filter(function() {
        return $(this).find('p').text().includes("Ocupada");
      }).length;
      var libres = totalMesas - ocupadas;
      
      $('.divResumen').html('<p>Mesas Libres: ' + libres + '</p><p>Mesas Ocupadas: ' + ocupadas + '</p>');
    }
  });
  