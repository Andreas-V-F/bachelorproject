export function initiate() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';
    document.body.appendChild(script);

    script.onload = () => {
        let script2 = document.createElement('script');
        script2.type = 'text/javascript';
        script2.integrity = "sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=";
        script2.crossOrigin = "anonymous";
        script2.src = 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js';
        document.body.appendChild(script2);

        script2.onload = () => {
            let script3 = document.createElement('script');
            script3.type = 'text/javascript';
            script3.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery-highlighttextarea/3.1.3/jquery.highlighttextarea.min.js';
            document.body.appendChild(script3);
        }
    }

    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/jquery-highlighttextarea/3.1.3/jquery.highlighttextarea.css";
    document.head.appendChild(link);

    link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css";
    document.head.appendChild(link);
}