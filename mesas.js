$(document).ready(function() {
  var currentMesa = null; // Almacena la mesa que se está reservando

  var userTipo = localStorage.getItem("tipo");
  if(userTipo !== "admin") {
    $(".divAsignadas").hide();
  } else {
    $(".divAsignadas").show();
  }

  // Cargar las mesas desde la API
  $.ajax({
    url: "http://localhost:3000/api/mesas",
    type: "GET",
    dataType: "json",
    success: function(response) {
      $('.divMesas').empty();
      // Por cada mesa recibida se crea una tarjeta
      response.forEach(function(mesa) {
        // Si el estado es "Libre", se muestra el botón de reservar; si no, se deshabilita
        var reservaBtn = '';
        if (mesa.estado === "Libre") {
          reservaBtn = '<button class="reservar-btn">Reservar</button>';
        } else {
          reservaBtn = '<button class="reservar-btn" disabled>Reservada</button>';
        }
        var mesaDiv = '<div class="mesa">' +
                        '<h3>' + mesa.nombreMesa + '</h3>' +
                        '<p>Estado: ' + mesa.estado + '</p>' +
                        reservaBtn +
                      '</div>';
        $('.divMesas').append(mesaDiv);
      });
      actualizarResumen();
    },
    error: function(err) {
      console.error("Error al cargar mesas", err);
    }
  });

  // Delegación de eventos para el botón "Reservar" (elementos cargados dinámicamente)
  $(document).on('click', '.reservar-btn', function() {
    currentMesa = $(this).closest('.mesa');
    $('#reservationName').val(''); // Limpiar el campo de entrada
    $('#reservationModal').fadeIn();
  });

  // Cerrar el modal al pulsar la "X"
  $('.modal .close').click(function() {
    $('#reservationModal').fadeOut();
  });

  // Cerrar el modal si se hace clic fuera del contenido
  $(window).click(function(event) {
    if ($(event.target).is('#reservationModal')) {
      $('#reservationModal').fadeOut();
    }
  });

  // Al confirmar la reserva en el modal
  $('#confirmReservation').click(function() {
    var name = $('#reservationName').val().trim();
    if (name === '') {
      alert("Por favor, introduce un nombre para la reserva.");
      return;
    }
    
    // Obtener el nombre de la mesa (del <h3>)
    var mesaName = currentMesa.find('h3').text();
    
    // Enviar la reserva al back para actualizar el estado de la mesa
    $.ajax({
      url: "http://localhost:3000/api/mesas/reservar",
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify({
        nombreMesa: mesaName,
        nombreReserva: name
      }),
      success: function(data) {
        // Actualizar la UI: cambiar el estado visual a "Ocupada" y deshabilitar el botón
        currentMesa.find('p').text("Estado: Ocupada");
        currentMesa.find('.reservar-btn').prop('disabled', true).text("Reservada");
        // Agregar la reserva al listado de asignaciones
        $('.divAsignadas').append('<p>' + mesaName + ' - ' + name + '</p>');
        actualizarResumen();
        $('#reservationModal').fadeOut();
      },
      error: function(err) {
        alert("Error reservando la mesa, intente nuevamente.");
        console.error("Error en la reserva:", err);
      }
    });
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

  // Redirigir a home al hacer clic en el logo
  $(".logo-name").click(function(){
    location.replace("home.html");
  });

  $(".logout").click(function(e){
    location.replace("index.html");
  });
});
