# Mandelbrot and Julia Fractals

Mandelbrot and Julia Fractals are probably the most famous [fractals](https://en.wikipedia.org/wiki/Fractal).

## Mandelbrot

The Mandelbrot set is the set of complex numbers $c$ for which the function $f_c(z)=z^{2}+c$ does not diverge when iterated from $z=0$, i.e. for which the sequence $0, f_c(0), f_c^2(0), f_c^3(0), etc$ is bounded, which can be proven to be equivalent to its norm $\mid f_c^n(0) \mid $ never exceeding 2 (the _escape radius_) for any $n$.

Its definition is credited to [Adrien Douady](https://en.wikipedia.org/wiki/Adrien_Douady) who named it in tribute to the mathematician [Benoit Mandelbrot](https://en.wikipedia.org/wiki/Benoit_Mandelbrot).

In the graphical representation of the Mandelbrot set in the first tab, each point in the plane is a complex number $c$ with real/imaginary parts equal to to its cartesian coordinates. The Mandelbrot sequence is calculated until it reaches the _escape radius_ or reaches a given maximum number of iterations.

The color of a point is defined by the iteration $p$ for which it reaches the _escape radius_: $RGB(f(Red \times p), f(Green \times p), f(Blue \times p))$, with

- $f()$ the function that transforms the sequence of positive natural integers [0, 1, 2, 3, etc] into the following sequence [0, 1, 2,.., 254, 255, 254,.., 1, 0, 1, etc]
- $[Red, Green, Blue]$ the vector defining the color gradient

In essence, this function is like a laser ray in the $[0-255]^3$ color space with initial direction $[Red, Green, Blue]$.

If it does not reach it within the maximum number of iterations, then it is black.

## Julia

In the graphical representation of the Julia set in the second tab, each point in the plane is a complex number $z$ with real/imaginary parts equal to to its cartesian coordinates. The Julia sequence is $f_c(z), f_c^2(z), f_c^3(z), etc$ where $c = r e^{ia}$ with:

- $r$ the **Radius** input field
- $a$ the angle moving from 0 to $2\pi$ - shown in degrees for convenience.
