// template
define([
	'underscore',
	'backbone',
	'jquery',
	'd3',
	'sankey',
	'VistaTooltip',
	'VistaEjesXY'
	], function(_, Backbone,$, d3,d3sankey, VistaTooltip, VistaEjesXY){

	var Visualizador = Backbone.View.extend(
		/** @lends Visualizador.prototype */
		{

		/**
		* @class VistaPrincipal vista que despliega visualizacion de ingresos vs costos de carreras
		*
		* @augments Backbone.View
		* @constructs
		*
		* @param {object} options parametros de incializacion
		* @param {array} options.data arreglo con datos (cada dato es un objeto con atributos)
		* @param {d3.select()} options.svg elemento SVG utilizado como contenedor del gráfico
		* @param {Backbone.View} options.tooltip vista utilizada como tooltip
		* Visualizador Inicia parametros de configuración y llamada a datos
		*/
		initialize: function() {
			this.data = this.options && this.options.data ? this.options.data : [];

			// Binding de this (esta vista) al contexto de las funciones indicadas
			_.bindAll(this,"render", "tootipMessage","seleccionaOrigen")

			// Alias a this para ser utilizado en callback functions
			var self = this; 

			// Configuración de espacio de despliegue de contenido en pantalla
			this.margin = {top: 20, right: 20, bottom: 30, left: 20},
	    	this.width = 1000 - this.margin.left - this.margin.right,
	    	this.height = 400 - this.margin.top - this.margin.bottom;

	   		this.color = d3.scale.category20c();

			// Vista con tooltip para mostrar datos del item respectivo
			this.tooltip = new VistaTooltip();
			this.tooltip.message = this.tootipMessage;

			this.color = d3.scale.category20();

			// append the svg canvas to the page
			this.svg = d3.select(this.el)
			    .attr("width", this.width + this.margin.left + this.margin.right)
			    .attr("height", this.height + this.margin.top + this.margin.bottom)
			  .append("g")
			    .attr("transform", 
			          "translate(" + this.margin.left + "," + this.margin.top + ")");


			this.dataRegiones = this.getDataInicial();
			
			//escala para la región
			this.yScale = d3.scale.ordinal()
			 	.domain([15,1,2,3,4,5,13,6,7,8,9,14,10,11,12])
			    .rangePoints([0,this.height],1)
			
			//escala para el numero de estudiantes
			this.xScale = d3.scale.linear()
		    	.range([0,this.width])
		     	.domain(d3.extent( this.dataRegiones, function(d) { return parseInt(d.estudiantes) } ))

		     // Crea Ejes X e Y	
			this.ejes = new VistaEjesXY({
				svg: this.svg,
				x:this.xScale, 
				y:this.yScale, 
				height: this.height, width: this.width, 
				labelX: "Alumnos",labelY: "Región"
			})

			this.nombre_regiones = {
				 "15": "Arica y Parinacota",
				 "1": "Tarapacá",
				 "2": "Antofagasta",
				 "3": "Atacama",
				 "4": "Coquimbo",
				 "5": "Valparaíso",
				 "13": "Metropolitana de Santiago",
				 "6": "Libertador General Bernardo O'Higgins",
				 "7": "Maule",
				 "8": "Biobío",
				 "9": "Araucanía",
				 "14": "Los Ríos",
				 "10": "Los Lagos",
				 "11": "Aysén del General Carlos Ibáñez del Campo",
				 "12": "Magallanes y de la Antártica Chilena",
		     	};


			this.render();

		},
		seleccionaOrigen:function(num){
			//console.log(num);
			this.dataRegiones = _.filter(this.data, function(d){return d.region_origen == num})
			//console.log(this.dataRegiones);
			this.render();
		},

		/**
		* Reescribe función generador de mensajes utilizado en herramienta de tooltip
		* tooltip.tooltipMessage(data) 	
		*
		* @param {object} data objeto con atributos (Ej: {nombre: "Juan", Edad: 18}) utilizados en la creación del mensaje a desplegar por tooltip
		* @returns {string} Mensaje (html) a ser utilizado por tooltip
		*/
		tootipMessage : function(d) {
			var formatNumber = d3.format(",.0f");

			var msg =   "Región "+ this.nombre_regiones[d.region_destino]   + " - "  + d.estudiantes +" estudiantes";

			return msg;

		}, 

		/**
		* Despliegue inicial de elementos gráficos.
		*/
		render: function() {
			var self = this; // Auxiliar para referirse a this en funciones callback
			self = this; // Para hacer referencia a "this" en callback functions

			var alturaBarra = 15;
			this.xScale = d3.scale.linear()
		    	.range([0,this.width])
		     	.domain(d3.extent( this.dataRegiones, function(d) { return parseInt(d.estudiantes) } ))

			 this.xAxis = d3.svg.axis()
			    .scale(this.xScale)
			    .orient("bottom");

			//rescribe los datos del eje x    
			this.ejes.x = this.xScale;
			this.ejes.redraw();


			this.nodes = this.svg.selectAll("rect")
				.data(this.dataRegiones, function(d) {return d.region_destino})

			//this.regionesChile = this.getRegionesCHile();

			this.nodes	
				.enter()
				.append("rect")
					.attr("x", 0)
					.attr("y", function(d,i) {return self.yScale(d.region_destino)-alturaBarra/2})
					.attr("width", function(d){return self.xScale(d.estudiantes)})
					.attr("height", alturaBarra) 
					.attr("fill", function(d,i) {return self.color(i)})
					.on("mouseenter", function(d) {
						self.tooltip.show(d)
					})
					.on("mouseout", function(d) {
						self.tooltip.hide()
					})

			this.nodes	
				.exit()
					.transition()
					.duration(1000)
					.attr("width",1);


			this.nodes
				.transition()
				.duration(1000)
				.attr("width", function(d){return self.xScale(d.estudiantes)})

		},
		/**
			datos iniciales
		*/
		getDataInicial:function(){
			return data = [
     	        {region_destino: "15", estudiantes: 0,value: "Arica y Parinacota"},
		        {region_destino: "1",  estudiantes: 0,value: "Tarapacá"},
		        {region_destino: "2",  estudiantes: 0,value: "Antofagasta"},
		        {region_destino: "3",  estudiantes: 0,value: "Atacama"},
		        {region_destino: "4",  estudiantes: 0,value: "Coquimbo"},
		        {region_destino: "5",  estudiantes: 0,value: "Valparaíso"},
		        {region_destino: "13", estudiantes: 0,value: "Metropolitana de Santiago"},
		        {region_destino: "6",  estudiantes: 0,value: "Libertador General Bernardo O'Higgins"},
		        {region_destino: "7",  estudiantes: 0,value: "Maule"},
		        {region_destino: "8",  estudiantes: 0,value: "Biobío"},
		        {region_destino: "9",  estudiantes: 0,value: "Araucanía"},
		        {region_destino: "14", estudiantes: 0,value: "Los Ríos"},
		        {region_destino: "10", estudiantes: 0,value: "Los Lagos"},
		        {region_destino: "11", estudiantes: 0,value: "Aysén del General Carlos Ibáñez del Campo"},
		        {region_destino: "12", estudiantes: 0,value: "Magallanes y de la Antártica Chilena"},
			] 
		},
		// getRegionesCHile:function(){
		// 	return data = [
  //    	        {region_destino: "15", value: "Arica y Parinacota"},
		//         {region_destino: "1",  value: "Tarapacá"},
		//         {region_destino: "2",  value: "Antofagasta"},
		//         {region_destino: "3",  value: "Atacama"},
		//         {region_destino: "4",  value: "Coquimbo"},
		//         {region_destino: "5",  value: "Valparaíso"},
		//         {region_destino: "13", value: "Metropolitana de Santiago"},
		//         {region_destino: "6",  value: "Libertador General Bernardo O'Higgins"},
		//         {region_destino: "7",  value: "Maule"},
		//         {region_destino: "8",  value: "Biobío"},
		//         {region_destino: "9",  value: "Araucanía"},
		//         {region_destino: "14", value: "Los Ríos"},
		//         {region_destino: "10", value: "Los Lagos"},
		//         {region_destino: "11", value: "Aysén del General Carlos Ibáñez del Campo"},
		//         {region_destino: "12", value: "Magallanes y de la Antártica Chilena"},
		// 	] 
		// },


	});
  
  return Visualizador;
});