define([
  'underscore',
  'backbone',
  'jquery',
  'd3',
	], function(_, Backbone,$, d3){

	var VistaPanelOpciones = Backbone.View.extend(
	/** @lends VistaPanelSelectorAreas.prototype */
	  {
		/**
		* @class VistaPanelSelectorAreas Panel con un elemento "select" que permite escoger un área que será utilizada para modificar el despliegue del gráfico
		*
		* @augments Backbone.View
		* @constructs
		*
		* @param {object} options parametros de incializacion
		* @param {string} options.el Identificador de elemento en DOM donde se despliegau la vista
		* @param {string} options.areas Arreglo con el listado de áreas a seleccionar (Ej. ["Salud", "Educación", ...])
		*/
		initialize: function() {
			console.log("test 111");
			this.render()
		},

		events: {
			//"click button.visualizacion": "seleccionaOrigen",
			"change select#id_inputArea" : "seleccionaOrigen"
		},

		seleccionaOrigen: function(e) {
			//var viztype = $(e.target).attr("viztype");
			region = $(e.target).val();
			this.trigger("seleccionaOrigen", region);
		},

		

		/**
		* Despliegua elementos visuales 	
		*/
		render: function() {
			
			this.areas = ["Seleccione una región","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15"]
			var selectorArea = d3.select(this.el)
			selectorArea.append("select")
				.attr("id", "id_inputArea")
				.selectAll("option")
				.data(this.areas)
				.enter()
					.append("option")
					.attr("value", function(d) {return d})
					.text(function(d) {return  d})


		}
	});
  
  return VistaPanelOpciones;
});

