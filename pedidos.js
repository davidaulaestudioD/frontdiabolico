$(document).ready(function() {
    // Variable para almacenar el total a pagar
    var total = 0.0;
  
    // Evento para el botón "Añadir" en cada plato
    $('.plato button').click(function() {
      var $plato = $(this).closest('.plato');
      var nombre = $plato.find('h3').text();
      // Extraer el precio eliminando "Precio:" y el símbolo "€"
      var precioTexto = $plato.find('p').text();
      var precio = parseFloat(precioTexto.replace('Precio:', '').replace('€', '').trim());
      
      // Actualizar el total
      total += precio;
      $('#totalAmount').text(total.toFixed(2) + '€');
      
      // Agregar el plato a la lista de seleccionados
      $('.divSeleccionados').append('<p>' + nombre + ' - ' + precio.toFixed(2) + '€</p>');
    });
  
    // Evento para el botón "Pagar"
    $('.boton-pagar').click(function() {
      alert('Pago realizado: ' + total.toFixed(2) + '€');
      total = 0;
      $('#totalAmount').text('0.00€');
      $('.divSeleccionados').empty();
    });
  
    // Evento para el botón "Limpiar Pedido"
    $('.boton-limpiar').click(function() {
      total = 0;
      $('#totalAmount').text('0.00€');
      $('.divSeleccionados').empty();
    });
  });
  