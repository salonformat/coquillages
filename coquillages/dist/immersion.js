// The painted world remains the source. WebGL moves the water very gently;
// scientific specimens and controls are never distorted by this effect.
export class PaintedWater{
  constructor(container){
    this.container=container;this.enabled=true;this.time=0;this.pointer=[.5,.5];this.ripple=0;this.last=0;this.ready=false;
    this.canvas=document.createElement('canvas');this.canvas.id='painted-water';this.canvas.setAttribute('aria-hidden','true');container.insertBefore(this.canvas,container.firstElementChild.nextSibling);
    const gl=this.canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});this.gl=gl;if(!gl)return;
    try{
      const vertex='attribute vec2 position;varying vec2 vUv;void main(){vUv=(position+1.0)*0.5;gl_Position=vec4(position,0.0,1.0);}';
      const fragment=`precision mediump float;
        uniform sampler2D painting;uniform vec2 resolution;uniform vec2 imageSize;uniform vec2 pointer;uniform float time;uniform float ripple;varying vec2 vUv;
        void main(){
          vec2 uv=vUv;float screenAspect=resolution.x/resolution.y;float imageAspect=imageSize.x/imageSize.y;
          vec2 cover=vec2(min(screenAspect/imageAspect,1.0),min(imageAspect/screenAspect,1.0));
          uv=(uv-.5)*cover+.5;
          vec2 drift=vec2(sin(uv.y*9.0+time*.30),cos(uv.x*10.0-time*.25))*.006;
          float dist=distance(vUv,vec2(pointer.x,1.0-pointer.y));
          float wave=sin(dist*36.0-time*1.7)*exp(-dist*3.0)*ripple*.007;
          uv+=drift+normalize(vUv-vec2(pointer.x,1.0-pointer.y)+.0001)*wave;
          vec3 color=texture2D(painting,uv).rgb;
          float light=pow(max(0.0,sin(uv.x*12.0+sin(uv.y*8.0+time*.12)+time*.09)),12.0)*.043;
          color+=vec3(.62,.85,1.0)*light;
          gl_FragColor=vec4(color,1.0);
        }`;
      const compile=(type,text)=>{const s=gl.createShader(type);gl.shaderSource(s,text);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error('Shader unavailable');return s;};
      this.program=gl.createProgram();gl.attachShader(this.program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(this.program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(this.program);if(!gl.getProgramParameter(this.program,gl.LINK_STATUS))throw new Error('Water unavailable');gl.useProgram(this.program);
      const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const position=gl.getAttribLocation(this.program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
      this.uniforms={};for(const name of ['resolution','imageSize','pointer','time','ripple'])this.uniforms[name]=gl.getUniformLocation(this.program,name);
      this.texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this.texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      this.resize=()=>{if(this.scene)this.setScene(this.scene);const dpr=Math.min(devicePixelRatio||1,1.5);this.canvas.width=innerWidth*dpr;this.canvas.height=innerHeight*dpr;gl.viewport(0,0,this.canvas.width,this.canvas.height);gl.uniform2f(this.uniforms.resolution,this.canvas.width,this.canvas.height);this.draw();};window.addEventListener('resize',this.resize);this.resize();
      window.addEventListener('pointermove',e=>{this.pointer=[e.clientX/innerWidth,e.clientY/innerHeight];this.ripple=.9;},{passive:true});
      window.addEventListener('pointerdown',e=>{this.pointer=[e.clientX/innerWidth,e.clientY/innerHeight];this.ripple=2.4;},{passive:true});
      this.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.ready=false;this.canvas.style.opacity='0';});
      this.frame=this.frame.bind(this);requestAnimationFrame(this.frame);
    }catch{this.ready=false;this.canvas.style.opacity='0';}
  }
  setScene(scene){this.scene=scene;if(!this.gl)return;const worlds={start:innerWidth<701?'assets/ocean-entry-mobile.jpg':'assets/ocean-entry.jpg',animal:'assets/world-snail.jpg',edge:'assets/world-aperture.jpg',growth:'assets/ocean-minimal.jpg',bivalve:'assets/world-mussel.jpg',transfer:'assets/world-shore.jpg',ending:'assets/world-ending.jpg',about:'assets/world-ending.jpg'};const src=worlds[scene]||worlds.start;if(src===this.src)return;this.src=src;const image=new Image();image.src=src;image.onload=()=>{if(this.src!==src)return;const gl=this.gl;gl.bindTexture(gl.TEXTURE_2D,this.texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);gl.uniform2f(this.uniforms.imageSize,image.width,image.height);this.ready=true;this.canvas.style.opacity=this.enabled?'1':'0';this.draw();};image.onerror=()=>{this.ready=false;this.canvas.style.opacity='0';};}
  setActive(active){this.enabled=active;if(this.canvas)this.canvas.style.opacity=active&&this.ready?'1':'0';}
  frame(now){const dt=Math.min(now-this.last,60);this.last=now;if(this.ready&&this.enabled&&!document.hidden){this.time+=dt/1000;this.ripple*=.992;this.draw();}requestAnimationFrame(this.frame);}
  draw(){if(!this.ready||!this.gl)return;const gl=this.gl;gl.useProgram(this.program);gl.uniform1f(this.uniforms.time,this.time);gl.uniform2f(this.uniforms.pointer,...this.pointer);gl.uniform1f(this.uniforms.ripple,this.ripple);gl.drawArrays(gl.TRIANGLES,0,6);}
}
