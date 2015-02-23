package nuclibook.models;

import com.j256.ormlite.dao.CloseableIterator;
import com.j256.ormlite.dao.ForeignCollection;
import com.j256.ormlite.field.DatabaseField;
import com.j256.ormlite.field.ForeignCollectionField;
import com.j256.ormlite.table.DatabaseTable;
import nuclibook.entity_utils.AbstractEntityUtils;
import nuclibook.server.Renderable;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@DatabaseTable(tableName = "staff")
public class Staff implements Renderable {

	@DatabaseField(generatedId = true)
	private Integer id;

	@DatabaseField(width = 64)
	private String username;

	@DatabaseField(width = 64)
	private String name;

	@DatabaseField(columnName = "role", foreign = true, foreignAutoRefresh = true)
	private StaffRole role;

	@DatabaseField
	private String passwordHash;

	@DatabaseField
	private String passwordSalt;

    @ForeignCollectionField(eager = true)
    private ForeignCollection<StaffAvailability> availabilities;

	@DatabaseField(defaultValue = "true")
	private Boolean enabled;

	public Staff() {
	}

	public int getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public StaffRole getRole() {
		return role;
	}

	public void setRole(StaffRole role) {
		this.role = role;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	/* PASSWORDS */

	public boolean checkPassword(String password) throws CannotHashPasswordException {
		// Add salt to password
		password = this.passwordSalt + password;

		// Check password
		return generateHash(password).equals(this.passwordHash);
	}

	public void setPassword(String password) throws CannotHashPasswordException {
		// Generate new random salt
		SecureRandom random = new SecureRandom();
		String salt = new BigInteger(130, random).toString(32);

		// Add salt to password
		password = salt + password;

		// Generate password hash
		String hash = generateHash(password);

		// Update fields
		this.passwordSalt = salt;
		this.passwordHash = hash;
	}

	private String generateHash(String text) throws CannotHashPasswordException {
		MessageDigest digest;
		try {
			digest = MessageDigest.getInstance("SHA-512");
		} catch (NoSuchAlgorithmException e) {
			throw new CannotHashPasswordException("No such MessageDigest algorithm");
		}

		byte[] hash;
		try {
			hash = digest.digest(text.getBytes("UTF-8"));
		} catch (UnsupportedEncodingException e) {
			throw new CannotHashPasswordException("Unsupported text encoding");
		}

		return String.format("%0128x", new BigInteger(1, hash));
	}

    /* AVAILABILITIES */

    public List<StaffAvailability> getStaffAvailability() {
        ArrayList<StaffAvailability> output = new ArrayList<>();
        CloseableIterator<StaffAvailability> iterator = availabilities.closeableIterator();
        try {
            StaffAvailability sa;
            while (iterator.hasNext()) {
                sa = iterator.next();
                if (sa != null) output.add(sa);
            }
        } finally {
            iterator.closeQuietly();
        }
        return output;
    }

    public String getStaffAvailabilityIdString() {
        List<StaffAvailability> StaffAvailability = getStaffAvailability();
        if (StaffAvailability.isEmpty()) return "0";
        StringBuilder sb = new StringBuilder();
        for (StaffAvailability p : StaffAvailability) {
            sb.append(p.getId()).append(",");
        }
        return sb.substring(0, sb.length() - 1);
    }

    public void clearStaffAvailability() {
        CloseableIterator<StaffAvailability> iterator = availabilities.closeableIterator();
        try {
            while (iterator.hasNext()) {
                AbstractEntityUtils.deleteEntity(StaffAvailability.class, iterator.next());
            }
        } finally {
            iterator.closeQuietly();
        }
    }

    public void addStaffAvailability(StaffAvailability sa) {
        sa.setStaff(this);
        AbstractEntityUtils.createEntity(StaffAvailability.class, sa);
    }

	@Override
	public HashMap<String, String> getHashMap() {
		return new HashMap<String, String>() {
			{
				put("id", ((Integer) getId()).toString());
				put("name", getName());
				put("username", getUsername());
				put("role-id", getRole() == null ? "0" : getRole().getId().toString());
				put("role-label", getRole() == null ? "-" : getRole().getLabel());
			}
		};
	}
}
