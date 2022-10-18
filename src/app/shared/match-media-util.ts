

export class MatchMediaUtil {
    public static prefersColorScheme="";
    public static setPrefersColorsScheme(){
        var theme="light";    //default to light
      
        //local storage is used to override OS theme settings
        if(localStorage.getItem("theme")){
            if(localStorage.getItem("theme") == "dark"){
                var theme = "dark";
            }
        } else if(!window.matchMedia) {
            //matchMedia method not supported
            console.log("matchMedia not supported");
        } else if(window.matchMedia("(prefers-color-scheme: dark)").matches) {
            //OS theme setting detected as dark
            var theme = "dark";
        }
        
        //dark theme preferred, set document with a `data-theme` attribute
        if (theme=="dark") {
              document.documentElement.setAttribute("data-theme", "dark");
              this.prefersColorScheme="dark";
        } else {
            document.documentElement.setAttribute("data-theme", "light");
            this.prefersColorScheme="light";
        } 
    }
}