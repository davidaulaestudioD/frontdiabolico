// $(document).ready(function() {
//   var total = 0.0;
//   var pedidosArray = [];

//   // Ocultar el contenedor de seleccionados inicialmente
//   $('.divSeleccionados').css("display", "none");

//   // Cargar los platos desde la API
//   $.ajax({
//     url: "http://localhost:3000/api/platos",
//     type: "GET",
//     dataType: "json",
//     success: function(response) {
//       $('.divPlatos').empty();
//       response.forEach(function(plato) {
//         var dishDiv = 
//           '<div class="plato">' +
//             '<h3>' + plato.nombrePlato + '</h3>' +
//             '<p>Precio: ' + plato.precio + '€</p>' +
//             '<button class="add-btn">Añadir</button>' +
//           '</div>';
//         $('.divPlatos').append(dishDiv);
//       });
//     },
//     error: function(err) {
//       console.error("Error al obtener los platos: ", err);
//     }
//   });

//   // Agregar plato al pedido
//   $(document).on('click', '.plato button', function() {
//     var $plato = $(this).closest('.plato');
//     var nombre = $plato.find('h3').text();
//     var precioTexto = $plato.find('p').text();
//     var precio = parseFloat(precioTexto.replace('Precio:', '').replace('€', '').trim());
    
//     total += precio;
//     $('#totalAmount').text(total.toFixed(2) + '€');
    
//     // Agregar el item al contenedor de seleccionados y mostrarlo
//     $('.divSeleccionados').append('<p>' + nombre + ' - ' + precio.toFixed(2) + '€</p>');
//     $('.divSeleccionados').css("display", "block");
    
//     // Agregar el item al array de pedidos
//     pedidosArray.push({ nombrePlato: nombre, precio: precio });
//   });

//   // Al pulsar "Pagar" se muestra el modal para confirmar el pedido
//   $('.boton-pagar').click(function() {
//     $('#orderModal').fadeIn();
//   });

//   // Cerrar el modal al pulsar la "X"
//   $('.modal .close-order').click(function() {
//     $('#orderModal').fadeOut();
//   });

//   // Cerrar el modal si se hace clic fuera de él
//   $(window).click(function(event) {
//     if ($(event.target).is('#orderModal')) {
//       $('#orderModal').fadeOut();
//     }
//   });

//   // Confirmar pedido: enviar datos al backend
//   $('#confirmOrder').click(function() {
//     var orderName = $('#orderName').val().trim();
//     var orderAddress = $('#orderAddress').val().trim();
//     var orderPhone = $('#orderPhone').val().trim();
    
//     if(orderName === '' || orderAddress === '' || orderPhone === '') {
//       alert("Por favor, completa todos los datos para el pedido.");
//       return;
//     }
    
//     var orderData = {
//       nombreCliente: orderName,
//       direccion: orderAddress,
//       telefono: orderPhone,
//       items: pedidosArray,
//       total: total.toFixed(2)
//     };
    
//     $.ajax({
//       url: "http://localhost:3000/api/pedidos",
//       type: "POST",
//       contentType: "application/json",
//       data: JSON.stringify(orderData),
//       success: function(data) {
//         total = 0;
//         pedidosArray = [];
//         $('#totalAmount').text('0.00€');
//         $('.divSeleccionados').empty().css("display", "none");
//         $('#orderModal').fadeOut();
//       },
//       error: function(err) {
//         alert("Error al realizar el pedido, intente nuevamente.");
//         console.error("Error en el pedido:", err);
//       }
//     });
//   });

//   // Botón para limpiar el pedido (opcional)
//   $('.boton-limpiar').click(function() {
//     total = 0;
//     pedidosArray = [];
//     $('#totalAmount').text('0.00€');
//     $('.divSeleccionados').empty().css("display", "none");
//   });

//   $(".logo-name").click(function(){
//     location.replace("home.html");
//   });

//   $(".logout").click(function(){
//     location.replace("index.html");
//   });
// });

$(document).ready(function() {
  const userTipo = localStorage.getItem("tipo");

  // Eventos comunes de navegación
  $(".logo-name").click(function() {
    location.replace("home.html");
  });
  $(".logout").click(function() {
    location.replace("index.html");
  });

  if (userTipo === "admin") {
    // Vista de administrador: se oculta el panel derecho y se cargan los pedidos
    $(".derecha").hide();
    //log prrrr
    $.ajax({
      url: "http://localhost:3000/api/pedidos",
      type: "GET",
      dataType: "json",
      success: function(response) {
        $('.divPlatos').empty();
        response.forEach(order => {
          const fechaStr = order.fecha ? `<p>Fecha: ${new Date(order.fecha).toLocaleString()}</p>` : '';
          const itemsList = (order.items && order.items.length > 0)
            ? `<p>Items:</p><ul>${order.items.map(item => `<li>${item.nombrePlato} - ${parseFloat(item.precio).toFixed(2)}€</li>`).join('')}</ul>`
            : '';
          const orderCard = `
            <div class="pedido-card" data-id="${order._id}">
              <h3>Pedido de: ${order.nombreCliente}</h3>
              <p>Teléfono: ${order.telefono}</p>
              <p>Dirección: ${order.direccion}</p>
              <p>Total: ${order.total}€</p>
              ${fechaStr}
              ${itemsList}
              <button class="delete-pedido-btn" data-id="${order._id}">Eliminar Pedido</button>
            </div>
          `;
          $('.divPlatos').append(orderCard);
        });
      },
      error: function(err) {
        console.error("Error al cargar pedidos:", err);
      }
    });
    
    // Eliminar pedido
    $(document).on('click', '.delete-pedido-btn', function() {
      const pedidoId = $(this).data("id");
      $.ajax({
        url: `http://localhost:3000/api/pedidos/${pedidoId}`,
        type: "DELETE",
        success: function() {
          $(`.pedido-card[data-id="${pedidoId}"]`).remove();
        },
        error: function(err) {
          alert("Error al eliminar el pedido, intente nuevamente.");
          console.error("Error al eliminar pedido:", err);
        }
      });
    });
    
  } else {
    // Vista de cliente: cargar platos y gestionar el pedido
    let total = 0.0;
    let pedidosArray = [];
    // Ocultar el contenedor de seleccionados inicialmente
    $('.divSeleccionados').css("display", "none");
    
    // Cargar los platos desde la API
    $.ajax({
      url: "http://localhost:3000/api/platos",
      type: "GET",
      dataType: "json",
      success: function(response) {
        $('.divPlatos').empty();
        response.forEach(plato => {
          const dishDiv = `
            <div class="plato">
              <h3>${plato.nombrePlato}</h3>
              <p>Precio: ${plato.precio}€</p>
              <button class="add-btn">Añadir</button>
            </div>
          `;
          $('.divPlatos').append(dishDiv);
        });
      },
      error: function(err) {
        console.error("Error al obtener los platos:", err);
      }
    });
    
    // Agregar plato al pedido
    $(document).on('click', '.plato button', function() {
      const $plato = $(this).closest('.plato');
      const nombre = $plato.find('h3').text();
      const precioTexto = $plato.find('p').text();
      const precio = parseFloat(precioTexto.replace('Precio:', '').replace('€', '').trim());
      
      total += precio;
      $('#totalAmount').text(total.toFixed(2) + '€');
      
      // Agregar el item al contenedor y mostrarlo
      $('.divSeleccionados').append(`<p>${nombre} - ${precio.toFixed(2)}€</p>`);
      $('.divSeleccionados').css("display", "block");
      
      // Agregar el item al array de pedidos
      pedidosArray.push({ nombrePlato: nombre, precio: precio });
    });
    
    // Mostrar modal de confirmación al pulsar "Pagar"
    $('.boton-pagar').click(function() {
      $('#orderModal').fadeIn();
    });
    
    // Cerrar modal al pulsar la "X"
    $('.modal .close-order').click(function() {
      $('#orderModal').fadeOut();
    });
    
    // Cerrar modal si se hace clic fuera
    $(window).click(function(event) {
      if ($(event.target).is('#orderModal')) {
        $('#orderModal').fadeOut();
      }
    });
    
    // Confirmar pedido: enviar datos al backend
    $('#confirmOrder').click(function() {
      const orderName = $('#orderName').val().trim();
      const orderAddress = $('#orderAddress').val().trim();
      const orderPhone = $('#orderPhone').val().trim();
      
      if(orderName === '' || orderAddress === '' || orderPhone === '') {
        alert("Por favor, completa todos los datos para el pedido.");
        return;
      }
      
      const orderData = {
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
        success: function() {
          total = 0;
          pedidosArray = [];
          $('#totalAmount').text('0.00€');
          $('.divSeleccionados').empty().css("display", "none");
          $('#orderModal').fadeOut();
        },
        error: function(err) {
          alert("Error al realizar el pedido, intente nuevamente.");
          console.error("Error en el pedido:", err);
        }
      });
    });
    
    // Botón para limpiar el pedido
    $('.boton-limpiar').click(function() {
      total = 0;
      pedidosArray = [];
      $('#totalAmount').text('0.00€');
      $('.divSeleccionados').empty().css("display", "none");
    });
  }
});
