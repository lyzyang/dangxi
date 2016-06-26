package models.information;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;

import com.avaje.ebean.Query;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import play.db.ebean.Model;

/**
 * @author lyz
 */
@Entity
public class InfoType extends Model{

	 /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	public long id;
	
	public String name;
	
	public static final Finder<Long, InfoType> finder = new Finder<Long, InfoType>(Long.class, InfoType.class);
	
	
	public static JsonNode getInfoTypeJson(){
		List<InfoType> infoType_list = finder.findList();
		ObjectMapper mapper = new ObjectMapper();
		ArrayNode array = mapper.createArrayNode ();
		for(InfoType it : infoType_list){
			ObjectNode appJson = mapper.createObjectNode ();
			appJson.put("id", it.id);
			appJson.put("text", it.name);
			array.add(appJson);
		}
		return array;
	}
	
	
	public static JsonNode getInfoTypePageJson(int limit,int offset,String order,String sort,String search){
		Query<InfoType> query = finder.query();
		if(sort != null && sort.length() != 0){
			sort = sort.replace("_", ".");
			query.where().orderBy(sort +" "+ order);
		}else{
			query.where().orderBy("id asc");
		}
		
		if(search != null && search.length() != 0) {
			query.where().disjunction()
				.like("name", "%" + search + "%");
		}

		int infoType_list_size = query.findRowCount();
		List<InfoType> infoType_list = query.where().setFirstRow(offset).setMaxRows(limit).findList();
		
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode json = mapper.createObjectNode ();
		json.put("total", infoType_list_size);
		ArrayNode array = mapper.createArrayNode ();
		for(InfoType infoType : infoType_list){
			ObjectNode appJson = mapper.createObjectNode();
			appJson.put("id", infoType.id);
			appJson.put("name", infoType.name);
			array.add(appJson);
		}
		json.put("rows", array);
		return json;
	}
	
	public void addInfoType(){
		this.save();
	}
	
	public void updateInfoType(){
		this.update();
	}
	
	public void delInfoType(String id_array){
		String[] array = id_array.split(",");
		for(String id: array){
			InfoType infoType = finder.byId(Long.valueOf(id));
			infoType.delete();
		}
	}
}
