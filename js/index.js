function listarCategorias(){
	ruta = "http://localhost/api/categoria/listar";
	$.get(ruta,function(result){
		combo = $("#inputCategoria");
		for(i=0;i<result.length;i++){
			dato = result[i];
			console.log(dato);
			opcion = '<option value="'+dato.id+'">'+dato.nombre+'</option>';
			combo.append(opcion);
		}
	},'json');
}
function listarProductos(){
	ruta = "http://localhost/api/producto/listar";
	tabla = $("#datos");//Obtengo la tabla
	tabla.html("");
	$.get(ruta,function(result){
		for(i=0;i<result.length;i++){
			//Creo la fila
			fila = '<tr>'+
				   '<td>'+result[i].nombre+'</td>'+
				   '<td>S/ '+result[i].precio+'</td>'+
				   '<td>'+result[i].stock+'</td>'+
				   '<td><button data-id="'+result[i].id+'" class="btn btn-info btnEditar"><i class="fas fa-edit"></i></button> '+
				   '<button data-id="'+result[i].id+'" class="btn btn-danger btnEliminar"><i class="fas fa-trash-alt"></i></button></td>'+
				   '</tr>';
			tabla.append(fila); //Añado la fila a la tabla
			console.log(result[i].nombre);
			console.log(result[i].precio);
		}
	},'json');
}
$(document).ready(function(){
	listarCategorias();
	listarProductos();
	$(".btnGuardar").click(function(){
		val_id = $("#inputId").val();
		if(val_id==""){ // Nuevo producto
			metodo = "POST";
			ruta = 'http://localhost/api/producto/nuevo';
		}else{ // Ya existe un id
			metodo = "PUT";
			ruta = 'http://localhost/api/producto/editar/'+val_id;
		}
		datos = {
			"categoria_id": $("#inputCategoria").val(),
			"nombre" : $("#inputNombre").val(),
			"precio" : $("#inputPrecio").val(),
			"stock" : $("#inputStock").val(),
			"imagen" : $("#inputImagen").val(),
			"estado" : $("#inputEstado").val()
		}
		$.ajax({
			url: ruta,
			type: metodo,
			data: JSON.stringify(datos),
			success: function(result){
				listarProductos();
				$("#exampleModal").modal('hide');
			}
		});
	});
	$("#datos").on('click','.btnEditar',function(){
		id = $(this).data("id");
		ruta = 'http://localhost/api/producto/mostrar/'+id;
		console.log(ruta);
		$.get(ruta,function(result){
			$("#inputId").val(result.id);
			$("#inputNombre").val(result.nombre);
			$("#inputPrecio").val(result.precio);
			$("#inputStock").val(result.stock);
			$("#inputImagen").val(result.imagen);
			$("#inputEstado").val(result.estado);
			$("#inputCategoria").val(result.categoria_id);
			$(".modal-title").html("Editar Producto");
			$("#exampleModal").modal('show');
		},'json');
	});
	$('#exampleModal').on('hidden.bs.modal', function (e) {
		$(".modal-title").html("Nuevo Producto");
		$("#inputId").val("");
		$("#inputNombre").val("");
		$("#inputPrecio").val("");
		$("#inputStock").val("");
		$("#inputImagen").val("");
		$("#inputEstado").val("A");
		$("#inputCategoria").val("0");
	});
	$("#datos").on('click','.btnEliminar',function(){
		resp = confirm("Esta seguro de eliminar este registro?");
		if(resp){ // si la respuesta es positiva
			//Obtenemos el valor del atributo data-id
			val_id = $(this).data("id");
			console.log("Eliminando "+val_id);
			$.ajax({
				url: 'http://localhost/api/producto/eliminar/'+val_id,
				type: 'delete',
				success: function(){
					listarProductos();
					$('.alert').css("display","block").alert();
				}
			});
		}
	});
});//Fin document.ready()