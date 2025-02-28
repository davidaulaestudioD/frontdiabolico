$(document).ready(function() {
  // Comprobar si el usuario es administrador (si no lo es, ocultar asignaciones)
  var userTipo = localStorage.getItem("tipo");
  if (userTipo !== "admin") {
    $(".divAsignadas").hide();
  } else {
    $(".divAsignadas").show();
  }

  var currentMesa = null; // Almacena la mesa que se está reservando

  // Cargar las mesas desde la API
  $.ajax({
    url: "http://localhost:3000/api/mesas",
    type: "GET",
    dataType: "json",
    success: function(response) {
      $('.divMesas').empty();
      $('.divAsignadas').empty(); // Limpiar asignaciones
      // Por cada mesa recibida se crea una tarjeta y se agrega a las asignaciones si está ocupada
      response.forEach(function(mesa) {
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

        // Si la mesa está ocupada, agregarla al divAsignadas
        if(mesa.estado === "Ocupada") {
          // Se asume que el campo "nombreReserva" contiene el nombre de la reserva
          $('.divAsignadas').append(
            '<p id="reserva-' + mesa.nombreMesa + '">' + mesa.nombreMesa + ' - ' + mesa.nombreReserva +
            ' <button class="borrar-reserva" data-mesa="' + mesa.nombreMesa + '">Borrar Reserva</button></p>'
          );
        }
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
    $('#reservationName').val(''); // Limpiar el campo de entrada del modal
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
    
    var mesaName = currentMesa.find('h3').text();
    
    // Enviar la reserva al backend para actualizar el estado de la mesa
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
        // Agregar la reserva al listado de asignaciones (solo si es admin)
        if(localStorage.getItem("tipo") === "admin") {
          $('.divAsignadas').append(
            '<p id="reserva-' + mesaName + '">' + mesaName + ' - ' + name +
            ' <button class="borrar-reserva" data-mesa="' + mesaName + '">Borrar Reserva</button></p>'
          );
        }
        actualizarResumen();
        $('#reservationModal').fadeOut();
      },
      error: function(err) {
        alert("Error reservando la mesa, intente nuevamente.");
        console.error("Error en la reserva:", err);
      }
    });
  });

  // Delegación de eventos para borrar la reserva (botón en el divAsignadas)
  $(document).on('click', '.borrar-reserva', function() {
    var mesaName = $(this).data("mesa");
    
    // Enviar petición al backend para borrar la reserva
    $.ajax({
      url: "http://localhost:3000/api/mesas/borrarReserva",
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify({ nombreMesa: mesaName }),
      success: function(data) {
        // Actualizar la tarjeta de la mesa: ponerla como "Libre" y habilitar el botón de reservar
        var mesaCard = $(".mesa").filter(function() {
          return $(this).find('h3').text().trim() === mesaName;
        });
        mesaCard.find('p').text("Estado: Libre");
        mesaCard.find('.reservar-btn').prop("disabled", false).text("Reservar");
        
        // Remover la reserva del listado buscando el párrafo que contenga el nombre de la mesa seguido de " -"
        $(".divAsignadas p").filter(function() {
          return $(this).text().indexOf(mesaName + " -") !== -1;
        }).remove();
        
        actualizarResumen();
      },
      error: function(err) {
        alert("Error al borrar la reserva, intente nuevamente.");
        console.error("Error borrando la reserva:", err);
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
});
