import {booleanAttribute, ChangeDetectionStrategy, Component, computed, DestroyRef, effect, ElementRef, inject, input, OnDestroy, output, PLATFORM_ID, signal, ViewChild} from '@angular/core';
import {CommonModule, isPlatformBrowser, isPlatformServer} from '@angular/common';
import {combineLatest, filter, from, interval, mergeMap, tap} from 'rxjs';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {HttpClient} from '@angular/common/http';
import {NumberToTimePipe} from '../../pipe/number.to.time/number.to.time.pipe';
import {DefaultIconsModule} from '../../module/default.icons/default.icons.module';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';

const getAudioContext =  () => {
  // @ts-ignore
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  return new AudioContext();
};

const decodeAudioData = (data: ArrayBuffer) => {
  return new Promise<AudioBuffer>((resolve, reject) => {
    getAudioContext().decodeAudioData(data, res => resolve(res), err => reject(err));
  });
};

@Component({
  selector: 'tp-audio-player',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    NumberToTimePipe,
    DefaultIconsModule
  ],
  templateUrl: './audio.player.component.html',
  styleUrls: ['./audio.player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioPlayerComponent implements OnDestroy {
  readonly url = input.required<string>();
  readonly fileName = input.required<string>();
  readonly visualData = input<Array<number>>([]);
  readonly canvasWidth = input<number>(420);
  readonly canvasHeight = input<number>(40);
  readonly duration = input<number>(0);
  readonly canRemove = input(true, {transform: booleanAttribute});
  readonly canSave = input(true, {transform: booleanAttribute});
  readonly removeClick = output();
  readonly positionChanged = output<number>();

  @ViewChild('canvasElement') set content(canvas: ElementRef<HTMLCanvasElement>) {
    if (!canvas || !!this.#ctx || isPlatformServer(this.#platformId)) {
      return;
    }
    this.#canvas = canvas;
    this.#ctx = canvas.nativeElement.getContext('2d');
    this.position.set(0);
  }

  readonly leftTime = computed(() => this.duration() - this.position());
  readonly position = signal<number>(-1);
  readonly isPlay = signal<boolean>(false);

  #ctx: CanvasRenderingContext2D | null = null;
  #audioContext!: AudioContext;
  #source!: AudioBufferSourceNode;
  #offsetPlay = 0;
  #canvas!: ElementRef<HTMLCanvasElement>;
  readonly #playStart =signal<number>(0);
  readonly #platformId = inject(PLATFORM_ID) as string;
  constructor() {
    const http = inject(HttpClient);
    const destroyRef = inject(DestroyRef);

    const audioContext$ = toObservable(this.url).pipe(
     filter(() => isPlatformBrowser(this.#platformId)),
     mergeMap(url => http.get(url, {responseType: 'arraybuffer'})),
     mergeMap(fileBuffer =>  from(decodeAudioData(fileBuffer) ))
    );

    combineLatest([
     audioContext$,
     toObservable(this.#playStart)
    ]).pipe(
     tap(([fileBuffer, playPosition]) => {
       this.stop();
       this.#offsetPlay = playPosition;
       this.#audioContext = getAudioContext();
       this.#audioContext.onstatechange = () => this.isPlay.set(this.#audioContext?.state === 'running')
       this.#source = this.#audioContext.createBufferSource();
       this.#source.onended = ( ) => this.stop();
       this.#source.buffer = fileBuffer;
       this.#source.connect(this.#audioContext.destination);
       if (this.#audioContext?.state !== 'running') {
         this.#source.start(0,  playPosition );
       } else {
         this.#audioContext.suspend();
       }
     }),
     takeUntilDestroyed(destroyRef)
    ).subscribe();
    
    interval(500).pipe(
     filter(() => this.isPlay()),
     takeUntilDestroyed(destroyRef)
    ).subscribe({
      next: () => {
        this.position.set(!this.#audioContext ? 0 : this.#audioContext.currentTime + this.#offsetPlay);
      }
    });

    effect(() => {
      if (this.position() > 0) {
        this.positionChanged.emit(this.position())
      }
      this.#refreshCanvas();
    });
  }

  ngOnDestroy() {
    this.stop();
  }

  playPause(): void {
    if (this.isPlay()) {
      this.#audioContext.suspend();
    } else {
      if (!this.#audioContext || this.#audioContext?.state === 'closed') {
        this.#playStart.set(0);
        return ;
      }
      this.#audioContext.resume();
    }
  }

  stop(): void {
    if (!!this.#source) {
      this.#source.disconnect();
      if (this.#audioContext.state !== 'closed') {
        this.#audioContext.close();
      }
    }
  }

  #refreshCanvas(): void {
    const visualData = this.visualData();
    if (!Array.isArray(visualData)) {
      return;
    }

    const step = this.canvasWidth() / visualData.length;
    visualData.reduce((acc, data) => {
      const p = acc * this.duration() / this.canvasWidth();
      const color = p > this.position() ? '#c4c4c4' : '#0084ff';
      if (!!this.#ctx) {
        this.#ctx?.beginPath();
        const h = this.canvasHeight() * data;
        this.#ctx?.rect(acc , this.canvasHeight() - h, 2, h);
        this.#ctx.fillStyle = color;
        this.#ctx?.fill();
      }
      return acc + step;
    }, 0);
  }
  
  onCanvasClick(event: MouseEvent) {
    if (this.isPlay()) {
      const xClick = (event.clientX - this.#canvas.nativeElement.getBoundingClientRect().left) * this.duration() / this.canvasWidth();
      this.#playStart.set(xClick);
    }
  }
}
