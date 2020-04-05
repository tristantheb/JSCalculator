# The Javascript calculator
This javascript calculator allows you to add anywhere on your site a simple javascript calculator.
From its simple design, it allows you the primary calculations but also the memorization of your results.

## How to install
1. Download the `.zip` archive folder.
2. Unpack it.
3. Move (or copy) the `calculator.min.js` file to the directory where your scripts are located.
4. Call this file in the HTML document in which you want to use this calculator.
5. Embed the calculator's HTML into your document. (Note that you can create multiple calculators on one page!).

Once the preparation is completed, it must be initialized:
1. In your javascript files, create a new file named `index.js`.
2. Insert the following code:
```js
document.addEventListener("DOMContentLoaded", function() {
  var calc1 = calculatorFactory("#calculator1");
  calc1.init();
});
```
**NOTE:** You have to change the calculator ID according to the one you gave in the HTML!
3. Call this new file in the HTML after the calculator file.

You are ready to use your calculator !

# Any Issues ?
If you encounter bugs or problems with this calculator, please report the error with as much detail as possible about the action taken in the Issues section.