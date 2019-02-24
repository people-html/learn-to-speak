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
		// 卡片是随机排列的
		isRandom : false ,
		// 切换卡片事件
		onUpdateStack : function( current ) { return false; }
	};

	function shuffle(array) {
	  var m = array.length, t, i;
	  while (m) {
	    i = Math.floor(Math.random() * m--);
	    t = array[m];
	    array[m] = array[i];
	    array[i] = t;
	  }
	  return array;
	}

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
		if ( this.options.isRandom ){
		    shuffle(this.items);
		}
		// 当前卡片索引
		this.current = 0;
		// set initial styles
		this.initSetting();
	};
	
	// 注册事件
	ElastiStack.prototype._initEvents = function() {
		var self = this;
		this.draggie.on( 'dragStart', function( i, e, p ) { self._onDragStart( i, e, p ); } );
		this.draggie.on( 'dragMove', function( i, e, p ) { self._onDragMove( i, e, p ); } );
		this.draggie.on( 'dragEnd', function( i, e, p ) { self._onDragEnd( i, e, p ); } );
	};

	ElastiStack.prototype._setStackStyle = function() {
		console.log(this.items)
		for (var ind = 0; ind < this.items.length; ind++) {
			const nowIndex = this.current + ind
			const item = this.items[nowIndex >= this.items.length ? nowIndex - this.items.length : nowIndex]
			console.log(item)
			if (ind < 3) {
				item.style.opacity = 1
				item.style.zIndex = 4 - ind
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
			onEndTransFn = function() {
				instance.element.removeEventListener( transEndEventName, onEndTransFn );
				
				// reset first item
				setTransformStyle( instance.element, is3d ? 'translate3d(0,0,-180px)' : 'translate(0,0,0)' );
				instance.element.style.left = instance.element.style.top = '0px';
				instance.element.style.zIndex = -1;
				classie.remove( instance.element, 'animate' );

				// reorder stack
				self.current = self.current < self.itemsCount - 1 ? self.current + 1 : 0;
				// new front items
				var item1 = self._firstItem(),
					item2 = self._secondItem(),
					item3 = self._thirdItem();

				// reset transition timing function
				classie.remove( item1, 'move-back' );
				if( item2 ) classie.remove( item2, 'move-back' );
				if( item3 ) classie.remove( item3, 'move-back' );

				setTimeout( function() {
					// the upcoming one will animate..
					classie.add( self._lastItem(), 'animate' );
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
		var item2 = this._secondItem(), item3 = this._thirdItem();

		classie.add( instance.element, 'move-back' );
		classie.add( instance.element, 'animate' );
		setTransformStyle( instance.element, is3d ? 'translate3d(0,0,0)' : 'translate(0,0)' );
		instance.element.style.left = '0px';
		instance.element.style.top = '0px';
	}

	ElastiStack.prototype._onDragStart = function( instance, event, pointer ) {
		classie.remove( instance.element, 'move-back' );
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
		this.draggie = new Draggabilly( this.items[ this.current ] );
	};

	ElastiStack.prototype._disableDragg = function() {
		this.draggie.disable();
	};

	// returns true if x or y is bigger than distDragMax
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

	// returns the first item in the stack
	ElastiStack.prototype._firstItem = function() {
		return this.items[ this.current ];
	};
	
	// returns the second item in the stack
	ElastiStack.prototype._secondItem = function() {
		if( this.itemsCount >= 2 ) {
			return this.current + 1 < this.itemsCount ? this.items[ this.current + 1 ] : this.items[ Math.abs( this.itemsCount - ( this.current + 1 ) ) ];
		}
	};
	
	// returns the third item in the stack
	ElastiStack.prototype._thirdItem = function() { 
		if( this.itemsCount >= 3 ) {
			return this.current + 2 < this.itemsCount ? this.items[ this.current + 2 ] : this.items[ Math.abs( this.itemsCount - ( this.current + 2 ) ) ];
		}
	};

	// returns the last item (of the first three) in the stack
	ElastiStack.prototype._lastItem = function() { 
		if( this.itemsCount >= 3 ) {
			return this._thirdItem();
		}
		else {
			return this._secondItem();
		}
	};

	ElastiStack.prototype.turnRandom = function() { 
		if ( this.options.isRandom ){
			var nowItem = this.items[this.current];
			this.items = [].slice.call( this.container.children );
			this.current = this.items.indexOf(nowItem);
			this.options.isRandom = false ;
		} else {
			var nowItem = this.items[this.current];
			this.items = [].slice.call( this.container.children );
		    shuffle(this.items);
			this.current = this.items.indexOf(nowItem);
			this.options.isRandom = true ;
		}
		var item1 = this._firstItem(), item2 = this._secondItem(), item3 = this._thirdItem();
		for ( var i = 0 ; i < this.items.length ; i ++ ){
			if ( this.items[i] !== item1 && this.items[i] !== item2 && this.items[i] !== item3  ){
				this.items[i].style.opacity = 0 ;
			} else {
				this.items[i].style.opacity = 1 ;
			}
		}
		this._setStackStyle();
	};

	ElastiStack.prototype.isRandom = function() { 
		return this.options.isRandom ;
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