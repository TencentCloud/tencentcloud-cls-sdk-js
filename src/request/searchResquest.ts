import { Request } from "./request";

export class SearchLogRequest extends Request{
    public TopicId: string;
	public LogsetId: string;
    public StartTime: string;
    public EndTime: string;
    public QueryString: string;
    public Limit: string;
    public Context: string | undefined;
    public Sort: string;

    constructor(topicId: string, logsetId: string, startTime: string, endTime: string, queryString: string, limit: string, context?:string, sort?:string) {
        super();
        this.TopicId = topicId;
        this.LogsetId = logsetId;
        this.StartTime = startTime;
        this.EndTime = endTime;
        this.QueryString = queryString;
        this.Limit = limit;
        this.Context = context;
        if (sort==undefined) {
            this.Sort = "desc"
        }
    }
}