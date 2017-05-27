package models.genealogy;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.db.ebean.Model;

/**
 * @author lyz
 */
@Entity
public class Appellation extends Model {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public static final long SPOUSE = 1;//1配偶
	public static final long CHILDREN = 2;//2子女
	
	@Id
	public long id;//1配偶 2子女
	
	public String appellation;
	
	public static final Finder<Long, Appellation> finder = new Finder<Long, Appellation>(Long.class, Appellation.class);
}
