import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {
  Canvas,
  IText,
  Rect,
  Circle,
  Triangle,
  FabricImage,
  Pattern,
  Group,
  loadSVGFromURL,
  type FabricObject,
} from 'fabric';

@Component({
  selector: 'angular-editor-fabric-js',
  templateUrl: './angular-editor-fabric-js.component.html',
  styleUrls: ['./angular-editor-fabric-js.component.css'],
  standalone: false,
})
export class FabricjsEditorComponent implements AfterViewInit {
  @ViewChild('htmlCanvas') htmlCanvas!: ElementRef;

  private canvas!: Canvas;
  public props = {
    canvasFill: '#ffffff',
    canvasImage: '',
    id: null as number | null,
    opacity: null as number | null,
    fill: '',
    fontSize: null as number | null,
    lineHeight: null as number | null,
    charSpacing: null as number | null,
    fontWeight: '',
    fontStyle: '',
    textAlign: '',
    fontFamily: '',
    TextDecoration: ''
  };

  public textString: string = '';
  public url: string | ArrayBuffer = '';
  public size: any = {
    width: 500,
    height: 800
  };

  public json: any;
  private globalEditor = false;
  public textEditor = false;
  private imageEditor = false;
  public figureEditor = false;
  public selected: any;

  constructor() { }

  ngAfterViewInit(): void {

    // setup front side canvas
    this.canvas = new Canvas(this.htmlCanvas.nativeElement, {
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: 'blue',
      isDrawingMode: true
    });

    this.canvas.on('selection:created', (e: any) => {
      const selectedObject: any = e.selected?.[0] ?? e.target;
      this.selected = selectedObject;
      selectedObject.transparentCorners = false;
      selectedObject.cornerColor = 'rgba(255, 87, 34, 0.7)';

      this.resetPanels();

      if (selectedObject.type !== 'group' && selectedObject) {

        this.getId();
        this.getOpacity();

        switch (selectedObject.type) {
          case 'rect':
          case 'circle':
          case 'triangle':
            this.figureEditor = true;
            this.getFill();
            break;
          case 'i-text':
            this.textEditor = true;
            this.getLineHeight();
            this.getCharSpacing();
            this.getBold();
            this.getFill();
            this.getTextDecoration();
            this.getTextAlign();
            this.getFontFamily();
            break;
          case 'image':
            break;
        }
      }
    });

    this.canvas.on('selection:cleared', (_e: any) => {
      this.selected = null;
      this.resetPanels();
    });

    this.canvas.setDimensions({ width: this.size.width, height: this.size.height });
  }


  /*------------------------Block elements------------------------*/

  // Block "Size"

  changeSize() {
    this.canvas.setDimensions({ width: this.size.width, height: this.size.height });
  }

  // Block "Add text"

  addText() {
    if (this.textString) {
      const text = new IText(this.textString, {
        left: 10,
        top: 10,
        fontFamily: 'helvetica',
        angle: 0,
        fill: '#000000',
        scaleX: 0.5,
        scaleY: 0.5,
        fontWeight: '',
      });

      this.extend(text, this.randomId());
      this.canvas.add(text);
      this.selectItemAfterAdded(text);
      this.textString = '';
    }
  }

  // Block "Add images"

  getImgPolaroid(event: any) {
    const el = event.target;
    loadSVGFromURL(el.src as string).then(({ objects, options }: { objects: (FabricObject | null)[], options: Record<string, any> }) => {
      const validObjects = objects.filter((o: FabricObject | null): o is FabricObject => o !== null);
      const image = new Group(validObjects, options as any);
      image.set({
        left: 10,
        top: 10,
        angle: 0,
        padding: 10,
        cornerSize: 10,
      });
      this.extend(image, this.randomId());
      this.canvas.add(image);
      this.selectItemAfterAdded(image);
    });
  }

  // Block "Upload Image"

  addImageOnCanvas(url: string | ArrayBuffer) {
    if (url) {
      FabricImage.fromURL(url as string).then((image: FabricImage) => {
        image.set({
          left: 10,
          top: 10,
          angle: 0,
          padding: 10,
          cornerSize: 10,
        });
        image.scaleToWidth(200);
        image.scaleToHeight(200);
        this.extend(image, this.randomId());
        this.canvas.add(image);
        this.selectItemAfterAdded(image);
      });
    }
  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        this.url = readerEvent.target!.result!;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeWhite(_url: string | ArrayBuffer) {
    this.url = '';
  }

  // Block "Add figure"

  addFigure(figure: string) {
    let add: FabricObject | undefined;
    switch (figure) {
      case 'rectangle':
        add = new Rect({
          width: 200, height: 100, left: 10, top: 10, angle: 0,
          fill: '#3f51b5'
        });
        break;
      case 'square':
        add = new Rect({
          width: 100, height: 100, left: 10, top: 10, angle: 0,
          fill: '#4caf50'
        });
        break;
      case 'triangle':
        add = new Triangle({
          width: 100, height: 100, left: 10, top: 10, fill: '#2196f3'
        });
        break;
      case 'circle':
        add = new Circle({
          radius: 50, left: 10, top: 10, fill: '#ff5722'
        });
        break;
    }
    if (add) {
      this.extend(add, this.randomId());
      this.canvas.add(add);
      this.selectItemAfterAdded(add);
    }
  }

  changeFigureColor(color) {
    this.canvas.getActiveObject().set("fill", color);
    this.canvas.renderAll();
  };

  /*Canvas*/

  cleanSelect() {
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  selectItemAfterAdded(obj: FabricObject) {
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
    this.canvas.setActiveObject(obj);
  }

  setCanvasFill() {
    if (!this.props.canvasImage) {
      this.canvas.backgroundColor = this.props.canvasFill;
      this.canvas.renderAll();
    }
  }

<<<<<<< HEAD
  extend(obj: any, id: number) {
    obj.toObject = ((toObject: () => any) => {
      return function(this: any) {
        return Object.assign(toObject.call(this), { id });
=======
  extend(obj, id) {
    obj.toObject = ((toObject) => {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          id
        });
>>>>>>> origin/master
      };
    })(obj.toObject);
  }

  setCanvasImage() {
    if (this.props.canvasImage) {
      this.props.canvasFill = '';
      const img = new window.Image();
      img.onload = () => {
        this.canvas.backgroundImage = new Pattern({ source: img, repeat: 'repeat' }) as any;
        this.canvas.renderAll();
      };
      img.src = this.props.canvasImage;
    }
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  /*------------------------Global actions for element------------------------*/

  getActiveStyle(styleName: string, object: any) {
    object = object || this.canvas.getActiveObject();
    if (!object) { return ''; }

    if (object.getSelectionStyles && object.isEditing) {
      return (object.getSelectionStyles()[styleName] || '');
    } else {
      return (object[styleName] || '');
    }
  }

  setActiveStyle(styleName: string, value: string | number, object: any) {
    object = object || this.canvas.getActiveObject();
    if (!object) { return; }

    if (object.setSelectionStyles && object.isEditing) {
      const style: any = {};
      style[styleName] = value;

      if (typeof value === 'string') {
        if (value.includes('underline')) {
          object.setSelectionStyles({ underline: true });
        } else {
          object.setSelectionStyles({ underline: false });
        }

        if (value.includes('overline')) {
          object.setSelectionStyles({ overline: true });
        } else {
          object.setSelectionStyles({ overline: false });
        }

        if (value.includes('line-through')) {
          object.setSelectionStyles({ linethrough: true });
        } else {
          object.setSelectionStyles({ linethrough: false });
        }
      }

      object.setSelectionStyles(style);
      object.setCoords();

    } else {
      if (typeof value === 'string') {
        if (value.includes('underline')) {
          object.set('underline', true);
        } else {
          object.set('underline', false);
        }

        if (value.includes('overline')) {
          object.set('overline', true);
        } else {
          object.set('overline', false);
        }

        if (value.includes('line-through')) {
          object.set('linethrough', true);
        } else {
          object.set('linethrough', false);
        }
      }

      object.set(styleName, value);
    }

    object.setCoords();
    this.canvas.renderAll();
  }


  getActiveProp(name: string) {
    const object: any = this.canvas.getActiveObject();
    if (!object) { return ''; }

    return object[name] || '';
  }

  setActiveProp(name: string, value: any) {
    const object = this.canvas.getActiveObject();
    if (!object) { return; }
    (object as any).set(name, value);
    object.setCoords();
    this.canvas.renderAll();
  }

  clone() {
    const activeObject = this.canvas.getActiveObject();

    if (activeObject) {
      activeObject.clone().then((cloned: FabricObject) => {
        cloned.set({ left: 10, top: 10 });
        this.canvas.add(cloned);
        this.selectItemAfterAdded(cloned);
      });
    }
  }

  getId() {
    this.props.id = (this.canvas.getActiveObject() as any)?.toObject().id ?? null;
  }

  setId() {
    const val = this.props.id;
    const activeObject = this.canvas.getActiveObject() as any;
    if (!activeObject) { return; }
    const complete = activeObject.toObject();
    console.log(complete);
    activeObject.toObject = () => {
      complete.id = val;
      return complete;
    };
  }

  getOpacity() {
    this.props.opacity = this.getActiveStyle('opacity', null) * 100;
  }

  setOpacity() {
    this.setActiveStyle('opacity', parseInt(String(this.props.opacity), 10) / 100, null);
  }

  getFill() {
    this.props.fill = this.getActiveStyle('fill', null);
  }

  setFill() {
    this.setActiveStyle('fill', this.props.fill, null);
  }

  getLineHeight() {
    this.props.lineHeight = this.getActiveStyle('lineHeight', null);
  }

  setLineHeight() {
    this.setActiveStyle('lineHeight', parseFloat(String(this.props.lineHeight)), null);
  }

  getCharSpacing() {
    this.props.charSpacing = this.getActiveStyle('charSpacing', null);
  }

  setCharSpacing() {
    this.setActiveStyle('charSpacing', this.props.charSpacing ?? 0, null);
  }

  getFontSize() {
    this.props.fontSize = this.getActiveStyle('fontSize', null);
  }

  setFontSize() {
    this.setActiveStyle('fontSize', parseInt(String(this.props.fontSize), 10), null);
  }

  getBold() {
    this.props.fontWeight = this.getActiveStyle('fontWeight', null);
  }

  setBold() {
    this.props.fontWeight = !this.props.fontWeight ? 'bold' : '';
    this.setActiveStyle('fontWeight', this.props.fontWeight, null);
  }

  setFontStyle() {
    this.props.fontStyle = !this.props.fontStyle ? 'italic' : 'normal';
    this.setActiveStyle('fontStyle', this.props.fontStyle, null);
  }

  getTextDecoration() {
    this.props.TextDecoration = this.getActiveStyle('textDecoration', null);
  }

  setTextDecoration(value: string) {
    let iclass = this.props.TextDecoration;
    if (iclass.includes(value)) {
      iclass = iclass.replace(new RegExp(value, 'g'), '');
    } else {
      iclass += ` ${value}`;
    }
    this.props.TextDecoration = iclass;
    this.setActiveStyle('textDecoration', this.props.TextDecoration, null);
  }

  hasTextDecoration(value: string) {
    return this.props.TextDecoration.includes(value);
  }

  getTextAlign() {
    this.props.textAlign = this.getActiveProp('textAlign');
  }

  setTextAlign(value: string) {
    this.props.textAlign = value;
    this.setActiveProp('textAlign', this.props.textAlign);
  }

  getFontFamily() {
    this.props.fontFamily = this.getActiveProp('fontFamily');
  }

  setFontFamily() {
    this.setActiveProp('fontFamily', this.props.fontFamily);
  }

  /*System*/


  removeSelected() {
    const activeObject: any = this.canvas.getActiveObject();
    const activeGroup: any = this.canvas.getActiveObjects();

<<<<<<< HEAD
    if (activeObject) {
      this.canvas.remove(activeObject);
    } else if (activeGroup) {
=======
    if (activeGroup) {
>>>>>>> origin/master
      this.canvas.discardActiveObject();
      activeGroup.forEach((object: FabricObject) => {
        this.canvas.remove(object);
      });
    } else if (activeObject) {
      this.canvas.remove(activeObject);
    }
  }

  bringToFront() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      this.canvas.bringObjectToFront(activeObject);
      (activeObject as any).opacity = 1;
    } else if (activeGroup) {
      this.canvas.discardActiveObject();
      activeGroup.forEach((object: FabricObject) => {
        this.canvas.bringObjectToFront(object);
      });
    }
  }

  sendToBack() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      this.canvas.sendObjectToBack(activeObject);
      (activeObject as any).opacity = 1;
    } else if (activeGroup) {
      this.canvas.discardActiveObject();
      activeGroup.forEach((object: FabricObject) => {
        this.canvas.sendObjectToBack(object);
      });
    }
  }

  confirmClear() {
    if (confirm('Are you sure?')) {
      this.canvas.clear();
    }
  }

  rasterize() {
    const image = new Image();
<<<<<<< HEAD
    image.src = this.canvas.toDataURL({ format: 'png', multiplier: 1 });
    const w = window.open('');
    w?.document.write(image.outerHTML);
=======
    image.src = this.canvas.toDataURL({ format: 'png' });
    const w = window.open('');
    w.document.write(image.outerHTML);
    this.downLoadImage();
  }

  downLoadImage() {
    const c = this.canvas.toDataURL({ format: 'png' });
    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = c;
    downloadLink.target = '_self';
    downloadLink.download = Date.now() + '.png';
    downloadLink.click();
>>>>>>> origin/master
  }

  rasterizeSVG() {
    const w = window.open('');
<<<<<<< HEAD
    w?.document.write(this.canvas.toSVG());
=======
    w.document.write(this.canvas.toSVG());
    this.downLoadSVG();
>>>>>>> origin/master
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(this.canvas.toSVG());
  }

  downLoadSVG() {
    const c = 'data:image/svg+xml;utf8,' + encodeURIComponent(this.canvas.toSVG());
    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = c;
    downloadLink.target = '_self';
    downloadLink.download = Date.now() + '.svg';
    downloadLink.click();
  }

  saveCanvasToJSON() {
    const json = JSON.stringify(this.canvas.toJSON());
    localStorage.setItem('Kanvas', json);
    console.log('json');
    console.log(json);
  }

  loadCanvasFromJSON() {
    const CANVAS = localStorage.getItem('Kanvas');
    console.log('CANVAS');
    console.log(CANVAS);

    if (CANVAS) {
      this.canvas.loadFromJSON(JSON.parse(CANVAS)).then(() => {
        console.log('CANVAS loaded');
        this.canvas.renderAll();
        console.log('this.canvas', this.canvas);
      });
    }
  }

  rasterizeJSON() {
    this.json = JSON.stringify(this.canvas.toJSON(), null, 2);
  }

  resetPanels() {
    this.textEditor = false;
    this.imageEditor = false;
    this.figureEditor = false;
  }

  drawingMode() {
    this.canvas.isDrawingMode = !this.canvas.isDrawingMode;
  }
}
