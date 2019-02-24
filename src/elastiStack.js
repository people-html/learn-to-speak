/**
 * elastiStack.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
;( function( window ) {
	
	'use strict';

	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	// 判断是否支持3D
	var is3d = !!getStyleProperty( 'perspective' ),
		supportTransitions = Modernizr.csstransitions,
		// transition end event name
		transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		isInit = false ;
	
	// 初始化
	function ElastiStack( el, options ) {
		this.container = el;
		this.options = extend( {}, this.options );
  		extend( this.options, options );
  		this._init();
	}

	//根据不同浏览器设置不同样式
	function setTransformStyle( el, tval ) {
		el.style.WebkitTransform = tval;
		el.style.msTransform = tval;
		el.style.transform = tval;
	}

	// 默认配置
	ElastiStack.prototype.options = {
		// 弹回距离
		distDragBack : 200,
		// 被移出距离
		distDragMax : 450,
		// 是否循环切换
		loop: false,
		// 拖动轴
		axis: 'x',
		// 切换卡片事件
		onUpdateStack : function( current ) { return false; }
	};

	// 初始化设置
	ElastiStack.prototype.initSetting = function(){
		this.itemsCount = this.items.length;
		this._setStackStyle();
		if( this.itemsCount <= 1 ) return;
		if ( !isInit ){
			this._initDragg();
			this._initEvents();
		}
		isInit = true ;
	}
	
	// 初始化
	ElastiStack.prototype._init = function() {
		// items
		this.items = [].slice.call( this.container.children );
		// 当前卡片索引
		this.current = 0;
		// set initial styles
		this.initSetting();
	};
	
	// 注册事件
	ElastiStack.prototype._initEvents = function() {
		this.draggie.on( 'dragStart', ( i, e, p ) => {
			this._onDragStart( i, e, p )
		})
		this.draggie.on( 'dragMove', ( i, e, p ) => {
			this._onDragMove( i, e, p )
		})
		this.draggie.on('dragEnd', ( i, e, p ) => {
			this._onDragEnd( i, e, p )
		})
	}

	ElastiStack.prototype._setStackStyle = function() {
		for (var ind = 0; ind < this.items.length; ind++) {
			const nowIndex = this.current + ind
			const item = this.items[nowIndex >= this.items.length ? nowIndex % this.items.length : nowIndex]
			if (ind < 3) {
				item.style.opacity = 1
				item.style.zIndex = 4 - ind
				// 添加动画标签
				classie.add( item, 'animate' )
				setTransformStyle( item, is3d ? 'translate3d(' + ind * 5 + 'px, 0, ' + ind * -10 + 'px)' : 'translate(' + ind * 5 + 'px, 0)' )
			} else {
				item.style.opacity = 0
				item.style.zIndex = 0
				setTransformStyle( item, is3d ? 'translate3d(10px, 0, -20px)' : 'translate(10px, 0)' )
			}
		}
	};

	ElastiStack.prototype._moveAway = function( instance ) {
		// disable drag
		this._disableDragg();
		
		// add class "animate"
		classie.add( instance.element, 'animate' );
		
		// calculate how much to translate in the x and y axis
		var tVal = this._getTranslateVal( instance );
		
		// apply it	
		setTransformStyle( instance.element, is3d ? 'translate3d(' + tVal.x + 'px,' + tVal.y + 'px, 0px)' : 'translate(' + tVal.x + 'px,' + tVal.y + 'px)' );
		
		// item also fades out
		instance.element.style.opacity = 0;
		

		// after transition ends..
		var self = this,
			// 动画结束事件
			onEndTransFn = function() {
				instance.element.removeEventListener( transEndEventName, onEndTransFn );
				
				// reset first item
				setTransformStyle( instance.element, is3d ? 'translate3d(0,0,-180px)' : 'translate(0,0,0)' );
				instance.element.style.left = instance.element.style.top = '0px';
				instance.element.style.zIndex = -1;
				classie.remove( instance.element, 'animate' );

				// reorder stack
				self.current = self.current < self.itemsCount - 1 ? self.current + 1 : 0;

				setTimeout(() => {
					// the upcoming one will animate..
					const item = self.items[self.current >= self.items.length ? self.current % self.items.length : self.current]
					classie.add( item, 'animate' );
					// reset style
					self._setStackStyle();
				}, 25 );

				// add dragging capability
				self._initDragg();

				// init drag events on new current item
				self._initEvents();

				// callback
				self.options.onUpdateStack( self.current );
			};

		if( supportTransitions ) {
			instance.element.addEventListener( transEndEventName, onEndTransFn );
		}
		else {
			onEndTransFn.call();
		}
	};

	ElastiStack.prototype._moveBack = function( instance ) {

		classie.add( instance.element, 'animate' );
		setTransformStyle( instance.element, is3d ? 'translate3d(0,0,0)' : 'translate(0,0)' );
		instance.element.style.left = '0px';
		instance.element.style.top = '0px';
	}

	// 卡片开始拖拽事件
	ElastiStack.prototype._onDragStart = function( instance, event, pointer ) {
		classie.remove( instance.element, 'animate' );
	};

	ElastiStack.prototype._onDragMove = function( instance, event, pointer ) {
		if( this._outOfBounds( instance ) ) {
			this._moveAway( instance );
		}
	};

	ElastiStack.prototype._onDragEnd = function( instance, event, pointer ) {
		if( this._outOfBounds( instance ) ) return;
		if( this._outOfSight(instance) ) {
			this._moveAway( instance );
		}
		else {
			this._moveBack( instance );
		}
	};

	ElastiStack.prototype._initDragg = function() {
		this.draggie = new Draggabilly( this.items[ this.current ], {
			axis: this.options.axis
		})
	};

	ElastiStack.prototype._disableDragg = function() {
		this.draggie.disable();
	};

	// 判断是否移出指定位置
	ElastiStack.prototype._outOfBounds = function( el ) {
		return Math.abs( el.position.x ) > this.options.distDragMax || Math.abs( el.position.y ) > this.options.distDragMax;
	};

	// returns true if x or y is bigger than distDragBack
	ElastiStack.prototype._outOfSight = function( el ) {
		return Math.abs( el.position.x ) > this.options.distDragBack || Math.abs( el.position.y ) > this.options.distDragBack;
	};

	ElastiStack.prototype._getTranslateVal = function( el ) {
		var h = Math.sqrt( Math.pow( el.position.x, 2 ) + Math.pow( el.position.y, 2 ) ),
			a = Math.asin( Math.abs( el.position.y ) / h ) / ( Math.PI / 180 ),
			hL = h + this.options.distDragBack,
			dx = Math.cos( a * ( Math.PI / 180 ) ) * hL,
			dy = Math.sin( a * ( Math.PI / 180 ) ) * hL,
			tx = dx - Math.abs( el.position.x ),
			ty = dy - Math.abs( el.position.y );
		
		return {
			x : el.position.x > 0 ? tx : tx * -1, 
			y : el.position.y > 0 ? ty : ty * -1
		}
	};

	
	ElastiStack.prototype.add = function(el){
		this.container.appendChild(el);
		this.items.push(el);
		this.initSetting();
	}
	
	ElastiStack.prototype.getSize = function(){
		return this.itemsCount ;
	}
	
	
	ElastiStack.prototype.getCurrent = function(){
		return this.current ;
	}
	
	ElastiStack.prototype.getCurrentItem = function(){
		return this.items[this.current] ;
	}
	
	ElastiStack.prototype.insert = function(el,index){
		this.container.insertBefore(el,this.container.childNodes[index]);
		this.items.splice(index, 0, el);
		this.initSetting();
	}
	
	ElastiStack.prototype.remove = function(index){
		if ( this.items.length === 0 ){
			return ;
		}
		if ( this.current >= index ){
			this.current -- ;
		}
		this.container.removeChild(this.container.childNodes[index]);
		this.items.splice(index, 1);
		if ( this.current >= this.items.length ){
			this.current = 0 ;
		}
		this.initSetting();

	}

	// add to global namespace
	window.ElastiStack = ElastiStack;

})( window );