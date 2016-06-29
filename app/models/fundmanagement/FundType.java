package models.fundmanagement;

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
public class FundType extends Model{

	 /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	public long id;
	
	public String name;
	
	public static final Finder<Long, FundType> finder = new Finder<Long, FundType>(Long.class, FundType.class);
	
	
	public static JsonNode getFundTypeJson(){
		List<FundType> fundType_list = finder.findList();
		ObjectMapper mapper = new ObjectMapper();
		ArrayNode array = mapper.createArrayNode ();
		for(FundType it : fundType_list){
			ObjectNode appJson = mapper.createObjectNode ();
			appJson.put("id", it.id);
			appJson.put("text", it.name);
			array.add(appJson);
		}
		return array;
	}
	
	
	public static JsonNode getFundTypePageJson(int limit,int offset,String order,String sort,String search){
		Query<FundType> query = finder.query();
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

		int fundType_list_size = query.findRowCount();
		List<FundType> fundType_list = query.where().setFirstRow(offset).setMaxRows(limit).findList();
		
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode json = mapper.createObjectNode ();
		json.put("total", fundType_list_size);
		ArrayNode array = mapper.createArrayNode ();
		for(FundType fundType : fundType_list){
			ObjectNode appJson = mapper.createObjectNode();
			appJson.put("id", fundType.id);
			appJson.put("name", fundType.name);
			array.add(appJson);
		}
		json.put("rows", array);
		return json;
	}
	
	public void addFundType(){
		this.save();
	}
	
	public void updateFundType(){
		this.update();
	}
	
	public void delFundType(String id_array){
		String[] array = id_array.split(",");
		for(String id: array){
			FundType fundType = finder.byId(Long.valueOf(id));
			fundType.delete();
		}
	}
}
