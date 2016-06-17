package controllers.information;

import java.io.File;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;

import models.UtilTool;
import models.information.Info;
import models.information.InfoType;
import play.data.DynamicForm;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Http.MultipartFormData;
import play.mvc.Http.MultipartFormData.FilePart;
import play.mvc.Result;
import views.html.information.infoTypes;

/**
 * @author lyz
 *
 */
public class InfoTypeController extends Controller {
	
	
	private final static Logger logger = LoggerFactory.getLogger(InfoTypeController.class); 
	
	/**
	 * 获取html页面
	 */
	public static Result infoType_html() {
		return ok(infoTypes.render());
	}
	
	
	public static Result infoType_page_json() {
		DynamicForm in = Form.form().bindFromRequest();
		int limit = Integer.valueOf(in.get("limit"));
		int offset = Integer.valueOf(in.get("offset"));
		String order = in.get("order");
		String sort = in.get("sort");
		String search = in.get("search");
		
		JsonNode json = InfoType.getInfoTypePageJson(limit,offset,order,sort,search);
		return ok(json);
	}
	
	
	/**
	 * 添加
	 */
	public static Result infoType_add(){  
		DynamicForm in = Form.form().bindFromRequest();
		String name = in.get("name");
		
		JsonNode json;
		if(name == null || name.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		InfoType infoType = new InfoType();
		infoType.name = name;

		try {
			infoType.addInfoType();
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
	public static Result infoType_up(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		String name = in.get("name");
		
		JsonNode json;
		if(sid == null || sid.length()==0
				|| name == null || name.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		InfoType infoType = InfoType.finder.byId(Long.valueOf(sid));
		infoType.name = name;
		
		try {
			infoType.updateInfoType();
			json = UtilTool.message(0, "修改成功!");
		} catch (Exception e) {
			logger.error("false",e);
			json = UtilTool.message(1, "修改失败!");
		}
		return ok(json);
	}
	
	/**
	 * 删除
	 * @return
	 */
	public static Result infoType_del(){
		DynamicForm in = Form.form().bindFromRequest();
		String id_array =in.get("id_array");
		
		JsonNode json;
		try {
			new InfoType().delInfoType(id_array);
			json = UtilTool.message(0, "删除成功!");
		} catch (Exception e) {
			logger.error("false",e);
			json = UtilTool.message(1, "删除失败,类型已被使用!");
		}
		
		return ok(json);
	}
	
}
