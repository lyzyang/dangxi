
import models.UtilTool;

import play.Application;
import play.GlobalSettings;
import play.api.mvc.EssentialFilter;
import play.filters.gzip.GzipFilter;
import play.libs.F;
import play.libs.F.Promise;
import play.mvc.Http.RequestHeader;
import play.mvc.SimpleResult;


/**
 * @author lyz
 */
public class Global extends GlobalSettings{
	
	 @SuppressWarnings("unchecked")
	 public <T extends EssentialFilter> Class<T>[] filters() {
        return new Class[]{GzipFilter.class};
     }
	
    @Override
    public void onStart(Application application){}
    
    @Override
    public void onStop(Application application){}
    
    public Promise<SimpleResult> onError(RequestHeader request, Throwable t) {
    	return F.Promise.promise(new F.Function0<SimpleResult>() {
			@Override
			public SimpleResult apply(){
				return play.mvc.Results.ok(UtilTool.message(1,"执行失败！"));
			}
		});
    }
    
}