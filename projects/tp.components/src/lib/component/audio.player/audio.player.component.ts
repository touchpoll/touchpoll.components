import {booleanAttribute, ChangeDetectionStrategy, Component, computed, DestroyRef, effect, ElementRef, inject, input, OnDestroy, output, PLATFORM_ID, signal, ViewChild} from '@angular/core';
import {CommonModule, isPlatformBrowser, isPlatformServer} from '@angular/common';
import {filter, firstValueFrom, interval} from 'rxjs';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {HttpClient} from '@angular/common/http';
import {NumberToTimePipe} from '../../pipe/number.to.time/number.to.time.pipe';
import {DefaultIconsModule} from '../../module/default.icons/default.icons.module';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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
  #audioBuffer: AudioBuffer | null = null;
  readonly #playStart =signal<number | null>(null);
  readonly #platformId = inject<string>(PLATFORM_ID);
  readonly #http = inject(HttpClient);
  constructor() {
    const destroyRef = inject(DestroyRef);

    effect( async () => {
      const playPosition = this.#playStart();
      if (playPosition === null) {
        return;
      }
      await this.#playFrom(playPosition);
    });

    interval(500).pipe(
     filter(() => this.isPlay()),
     takeUntilDestroyed(destroyRef)
    ).subscribe(() => this.position.set(!this.#audioContext ? 0 : this.#audioContext.currentTime + this.#offsetPlay));

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
  
  onCanvasClick(event: MouseEvent) {
    const xClick = (event.clientX - this.#canvas.nativeElement.getBoundingClientRect().left) * this.duration() / this.canvasWidth();
    this.#playStart.set(xClick);
  }
  
  async #loadAudioContext(url: string): Promise<AudioBuffer | null> {
    if (!isPlatformBrowser(this.#platformId)) {
      return null ;
    } else {
      try {
        const fileBuffer = await firstValueFrom(this.#http.get(url, {responseType: 'arraybuffer'}))
        return await decodeAudioData(fileBuffer)
      } catch (e) {
        console.error(e);
        return null;
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

  async #playFrom(playPosition: number): Promise<void> {
    if (!this.#audioBuffer) {
      this.#audioBuffer = await this.#loadAudioContext(this.url());
    }
    this.stop();
    this.#offsetPlay = playPosition;
    this.#audioContext = getAudioContext();
    this.#audioContext.onstatechange = () => this.isPlay.set(this.#audioContext?.state === 'running')
    this.#source = this.#audioContext.createBufferSource();
    this.#source.onended = ( ) => this.stop();
    this.#source.buffer = this.#audioBuffer;
    this.#source.connect(this.#audioContext.destination);
    this.#source.start(0,  playPosition );
  }
}
