package controllers.information;

import java.io.File;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;

import models.UtilTool;
import models.information.Info;
import play.data.DynamicForm;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Http.MultipartFormData;
import play.mvc.Http.MultipartFormData.FilePart;
import play.mvc.Result;
import views.html.information.infos;

/**
 * @author lyz
 *
 */
public class InfoController extends Controller {
	
	
	private final static Logger logger = LoggerFactory.getLogger(InfoController.class); 
	
	/**
	 * 获取html页面
	 */
	public static Result info_html() {
		return ok(infos.render());
	}
	
	
	public static Result info_page_json() {
		DynamicForm in = Form.form().bindFromRequest();
		int limit = Integer.valueOf(in.get("limit"));
		int offset = Integer.valueOf(in.get("offset"));
		String order = in.get("order");
		String sort = in.get("sort");
		String search = in.get("search");
		String type = in.get("type");
		
		JsonNode json = Info.getInfoPageJson(limit,offset,order,sort,search,type);
		return ok(json);
	}
	
	
	/**
	 * 添加
	 */
	public static Result info_add(){  
		String user_id = Controller.session("id");
		
		DynamicForm in = Form.form().bindFromRequest();
		String kks_ids = in.get("kks_ids");
		String name = in.get("name");
		String remark = in.get("remark");
		String qe = in.get("qe");
		
		MultipartFormData body = request().body().asMultipartFormData();
		FilePart picture = null;
		try {
			picture = body.getFile("picture");
		} catch (Exception e1) {
		}
		
		JsonNode json;
		if(kks_ids == null || kks_ids.length()==0
				||name == null || name.length()==0
				||qe == null || qe.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		if (picture != null) {
			File file = picture.getFile();
			if(!UtilTool.isImage(file)){
				json = UtilTool.message(1, "只能上传图片！");
		    	return ok(json);
			}
			if(file.length()>1048576){
				json = UtilTool.message(1, "图片不能大于10M！");
		    	return ok(json);
			}
		}
		
		Info info = new Info();
		info.remark = remark;

		
		try {
			info.addInfo();
			json = UtilTool.message(0, "添加成功!");
		} catch (Exception e) {
			logger.error("false",e);
			json = UtilTool.message(1, "添加失败!");
		}
    	return ok(json);
	}
	
	/**
	 * 修改
	 * @return
	 */
	public static Result info_up(){
		String user_id = Controller.session("id");
		
		DynamicForm in = Form.form().bindFromRequest();
		long sid = Long.valueOf(in.get("sid"));
		Info info = Info.finder.byId(sid);
		
		JsonNode json;
		try {
			info.updateInfo();
			json = UtilTool.message(0, "添加成功!");
		} catch (Exception e) {
			logger.error("false",e);
			json = UtilTool.message(1, "添加失败!");
		}
		return ok(json);
	}
	
	/**
	 * 删除
	 * @return
	 */
	public static Result info_del(){
		String user_id = Controller.session("id");
		
		DynamicForm in = Form.form().bindFromRequest();
		String id_array =in.get("id_array");
		
		JsonNode json;
		try {
			new Info().delInfo(id_array);
			json = UtilTool.message(0, "删除成功!");
		} catch (Exception e) {
			logger.error("false",e);
			json = UtilTool.message(1, "删除失败,特征已被使用!");
		}
		
		return ok(json);
	}
	
}
