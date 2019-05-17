import logs from "@logs/*";
import * as morgan from "morgan"

export default morgan("dev", {
    stream: {
        write: (stream) => {
            if(typeof stream == "string") stream = stream.replace("\n", "");
            logs.logExpress.info(stream);
        }
    }
})