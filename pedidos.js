$(document).ready(function() {
  var total = 0.0;
  var pedidosArray = [];

  // Cargar los platos desde la API
  $.ajax({
    url: "http://localhost:3000/api/platos",
    type: "GET",
    dataType: "json",
    success: function(response) {
      $('.divPlatos').empty();
      response.forEach(function(plato) {
        var dishDiv = 
          '<div class="plato">' +
            '<h3>' + plato.nombrePlato + '</h3>' +
            '<p>Precio: ' + plato.precio + '€</p>' +
            '<button class="add-btn">Añadir</button>' +
          '</div>';
        $('.divPlatos').append(dishDiv);
      });
    },
    error: function(err) {
      console.error("Error al obtener los platos: ", err);
    }
  });

  // Agregar plato al pedido
  $(document).on('click', '.plato button', function() {
    var $plato = $(this).closest('.plato');
    var nombre = $plato.find('h3').text();
    var precioTexto = $plato.find('p').text();
    var precio = parseFloat(precioTexto.replace('Precio:', '').replace('€', '').trim());
    
    total += precio;
    $('#totalAmount').text(total.toFixed(2) + '€');
    
    // Mostrar visualmente el item añadido
    $('.divSeleccionados').append('<p>' + nombre + ' - ' + precio.toFixed(2) + '€</p>');
    
    // Agregar el item al array de pedidos
    pedidosArray.push({ nombrePlato: nombre, precio: precio });
  });

  // Al pulsar "Pagar" se muestra el modal para confirmar el pedido
  $('.boton-pagar').click(function() {
    $('#orderModal').fadeIn();
  });

  // Cerrar el modal al pulsar la "X"
  $('.modal .close-order').click(function() {
    $('#orderModal').fadeOut();
  });

  // Cerrar el modal si se hace clic fuera de él
  $(window).click(function(event) {
    if ($(event.target).is('#orderModal')) {
      $('#orderModal').fadeOut();
    }
  });

  // Confirmar pedido: enviar datos al backend
  $('#confirmOrder').click(function() {
    var orderName = $('#orderName').val().trim();
    var orderAddress = $('#orderAddress').val().trim();
    var orderPhone = $('#orderPhone').val().trim();
    
    if(orderName === '' || orderAddress === '' || orderPhone === '') {
      alert("Por favor, completa todos los datos para el pedido.");
      return;
    }
    
    var orderData = {
      nombreCliente: orderName,
      direccion: orderAddress,
      telefono: orderPhone,
      items: pedidosArray,
      total: total.toFixed(2)
    };
    
    $.ajax({
      url: "http://localhost:3000/api/pedidos",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(orderData),
      success: function(data) {
        total = 0;
        pedidosArray = [];
        $('#totalAmount').text('0.00€');
        $('.divSeleccionados').empty();
        $('#orderModal').fadeOut();
      },
      error: function(err) {
        alert("Error al realizar el pedido, intente nuevamente.");
        console.error("Error en el pedido:", err);
      }
    });
  });

  // Botón para limpiar el pedido (opcional)
  $('.boton-limpiar').click(function() {
    total = 0;
    pedidosArray = [];
    $('#totalAmount').text('0.00€');
    $('.divSeleccionados').empty();
  });


  $(".logo-name").click(function(){
    location.replace("home.html");
  });

  $(".logout").click(function(e){
    location.replace("index.html");
  });
});
