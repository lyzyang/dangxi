package models.focusmap;

import java.util.List;

import com.avaje.ebean.Query;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import models.UtilTool;
import models.information.Info;

/**
 * @author lyz
 */
public class Focus{

		
	public static JsonNode getFocusByNum(int limit){
		
		List<Info> info_list = Info.finder.where().eq("type", 1).eq("pictureType", 1).setMaxRows(limit).findList();
		
		ObjectMapper mapper = new ObjectMapper();
		ArrayNode array = mapper.createArrayNode ();
		for(Info info : info_list){
			ObjectNode appJson = mapper.createObjectNode();
			appJson.put("id", info.id);
			appJson.put("title", info.title);
			appJson.put("remark", info.remark);
			appJson.put("user_userName", info.user.userName);
			appJson.put("createTime",  UtilTool.DateToString(info.createTime));
			appJson.put("lastUpdateTime", UtilTool.DateToString(info.lastUpdateTime));
			
			appJson.put("picture", info.picture);
			
			appJson.put("pictureType", info.pictureType);
			if(info.pictureType == 1) appJson.put("pictureType_name", "焦点图");
			
			array.add(appJson);
		}
		return array;
	}
	
	
	public static JsonNode getFocusPageJson(int limit,int offset,String order,String sort,String search){
		Query<Info> query = Info.finder.query();
		if(sort != null && sort.length() != 0){
			sort = sort.replace("_", ".");
			query.where().orderBy(sort +" "+ order);
		}else{
			query.where().orderBy("pictureType desc");
		}
		
		query.where().eq("type", 1);
		
		if(search != null && search.length() != 0) {
			query.where().disjunction()
				.like("title", "%" + search + "%")
				.like("remark", "%" + search + "%")
				.like("infoType.name", "%" + search + "%")
				.like("user.userName", "%" + search + "%");
		}

		int info_list_size = query.findRowCount();
		List<Info> info_list = query.where().setFirstRow(offset).setMaxRows(limit).findList();
		
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode json = mapper.createObjectNode ();
		json.put("total", info_list_size);
		ArrayNode array = mapper.createArrayNode ();
		for(Info info : info_list){
			ObjectNode appJson = mapper.createObjectNode();
			appJson.put("id", info.id);
			appJson.put("title", info.title);
			appJson.put("remark", info.remark);
			appJson.put("user_userName", info.user.userName);
			appJson.put("createTime",  UtilTool.DateToString(info.createTime));
			appJson.put("lastUpdateTime", UtilTool.DateToString(info.lastUpdateTime));
			
			appJson.put("picture", info.picture);
			
			appJson.put("pictureType", info.pictureType);
			if(info.pictureType == 1) appJson.put("pictureType_name", "焦点图");
			
			array.add(appJson);
		}
		json.put("rows", array);
		return json;
	}
		
		
}
