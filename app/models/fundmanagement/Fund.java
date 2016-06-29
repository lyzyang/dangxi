package models.fundmanagement;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.avaje.ebean.Query;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import models.UtilTool;
import models.information.Info;
import models.userbehavior.AuthorisedUser;
import play.db.ebean.Model;

/**
 * @author lyz
 */
@Entity
public class Fund extends Model{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	public long id;
	
	@ManyToOne
	public FundType fundType;
	
	@Column(columnDefinition="int4 default 0")
	public int type;//0支出 1收入
	
	@Column(columnDefinition="float8 default 0")
	public Double amount;
	
	public String remark;
	
	@ManyToOne
	public Info info;
	
	@ManyToOne
	public AuthorisedUser user;
	
	public Date createTime;
	public Date lastUpdateTime;
	
	public static final Finder<Long, Fund> finder = new Finder<Long, Fund>(Long.class, Fund.class);
	
	
	public static JsonNode getFundPageJson(int limit,int offset,String order,String sort,String search,String type,String fundType_id){
		Query<Fund> query = finder.query();
		if(sort != null && sort.length() != 0){
			sort = sort.replace("_", ".");
			query.where().orderBy(sort +" "+ order);
		}else{
			query.where().orderBy("createTime asc");
		}
		
		if(type !=null && type.length() != 0){
			query.where().eq("type", Integer.valueOf(type));
		}
		
		if(fundType_id !=null && fundType_id.length() != 0){
			FundType ft = new FundType();
			ft.id = Integer.valueOf(fundType_id);
			query.where().eq("fundType", ft);
		}
		
		if(search != null && search.length() != 0) {
			query.where().disjunction()
				.like("remark", "%" + search + "%")
				.like("user.userName", "%" + search + "%");
		}

		int fund_list_size = query.findRowCount();
		List<Fund> fund_list = query.where().setFirstRow(offset).setMaxRows(limit).findList();
		
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode json = mapper.createObjectNode ();
		json.put("total", fund_list_size);
		ArrayNode array = mapper.createArrayNode ();
		for(Fund fund : fund_list){
			ObjectNode appJson = mapper.createObjectNode();
			appJson.put("id", fund.id);
			
			appJson.put("fundType_id", fund.fundType.id);
			appJson.put("fundType_name", fund.fundType.name);
			
			appJson.put("type", fund.type);
			if(fund.type == 1) appJson.put("type_name", "收入");
			else appJson.put("type_name", "支出");
			
			appJson.put("amount", fund.amount);
			appJson.put("remark", fund.remark);
			
			if(fund.info != null){
				appJson.put("info_id", fund.info.id);
				appJson.put("info_tile", fund.info.title);
			}
			
			appJson.put("user_userName", fund.user.userName);
			appJson.put("createTime",  UtilTool.DateToString(fund.createTime));
			
			array.add(appJson);
		}
		json.put("rows", array);
		return json;
	}
	
	
	public void addFund(){
		this.save();
	}
	
	public void updateFund(){
		this.update();
	}
	
	public void delFund(String id_array){
		String[] array = id_array.split(",");
		for(String id: array){
			Fund fund = finder.byId(Long.valueOf(id));
			fund.delete();
		}
	}
}
