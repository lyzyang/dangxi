package controllers.admanage;

import java.io.File;

import be.objectify.deadbolt.java.actions.Pattern;

import com.fasterxml.jackson.databind.JsonNode;

import models.UtilTool;
import models.admanage.Advert;
import play.data.DynamicForm;
import play.data.Form;
import play.db.ebean.Transactional;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Http.MultipartFormData;
import play.mvc.Http.MultipartFormData.FilePart;
import views.html.admanage.advertSets;

/**
 * @author lyz
 *
 */
public class AdvertController extends Controller {
	
	/**
	 * 获取广告信息
	 * @return
	 */
	public static Result advertSet_get() {
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		
		if(sid == null || sid.length()==0 || sid.equals("0")){
			sid = "0";
		}
		
		JsonNode json = Advert.getAdvertGet(Long.valueOf(sid));
		return ok(json);
	}
	
	
	///////////////////////////////////////////
	
	
	
	/**
	 * 获取html页面
	 */
	@Pattern("advertSet_html")
	public static Result advertSet_html() {
		return ok(advertSets.render());
	}
	
	/**
	 * 广告列表
	 * @return
	 */
	@Pattern("advertSet_html")
	public static Result advertSet_page_json() {
		DynamicForm in = Form.form().bindFromRequest();
		int limit = Integer.valueOf(in.get("limit"));
		int offset = Integer.valueOf(in.get("offset"));
		String order = in.get("order");
		String sort = in.get("sort");
		String search = in.get("search");
		
		JsonNode json = Advert.getAdvertPageJson(limit,offset,order,sort,search);
		return ok(json);
	}
	
	/**
	 * 修改
	 * @return
	 */
	@Pattern("advertSet_html")
	@Transactional
	public static Result advertSet_up(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		String url = in.get("url");
		String isexit = in.get("isexit");
		
		JsonNode json;
		if(sid == null || sid.length()==0
				||url == null || url.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		MultipartFormData body = request().body().asMultipartFormData();
		FilePart picture = null;
		try {
			picture = body.getFile("picture");
		} catch (Exception e1) {
		}
		
		String pic = "";
		if (picture != null) {
			File file = picture.getFile();
			if(!UtilTool.isImage(file)){
				json = UtilTool.message(1, "只能上传图片！");
		    	return ok(json);
			}
			if(file.length()>1048576){
				json = UtilTool.message(1, "图片不能大于1M！");
		    	return ok(json);
			}
			pic = UtilTool.fileToString(file);
		}
		
		Advert advert = Advert.finder.byId(Long.valueOf(sid));
		advert.url = url;
		
		if(pic.length() != 0){
			advert.picture = pic;
		}else if(isexit != null && isexit.equals("1")){
			advert.picture = "";
		}
		
		advert.updateAdvert();
		json = UtilTool.message(0, "设置成功!");

		return ok(json);
	}
	
}
