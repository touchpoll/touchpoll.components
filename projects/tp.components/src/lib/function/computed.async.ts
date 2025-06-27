import {Observable} from 'rxjs';
import {effect, signal, Signal} from '@angular/core';

// Receives a function that must return an observable
export function computedAsync<T, U = undefined>(computation: () => Observable<T>, options?: {initialValue?: U},): Signal<T | U> {
  // Creates a signal that where the observable result will be stored
  const sig = signal<T | U>(options?.initialValue as U);
  // Uses effect to make sure that if there are changes in the computation
  // that it gets re-runned
  // Get the observable
  effect(() => {
    // Reset signal value
    // sig.set(null);
    // Get the observable
    const observable = computation();
    // Subscribe and store the result in the signal
    observable.subscribe(result => sig.set(result as T));
    // observable.pipe(startWith(options?.initialValue as U)).subscribe(result => sig.set(result as T));
  });
  
  return sig;
}
