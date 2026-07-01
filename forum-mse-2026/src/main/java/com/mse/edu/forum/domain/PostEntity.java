package com.mse.edu.forum.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "posts")
public class PostEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String title;

	@Column(nullable = false, length = 1000) // limit to 1000 instead of 10k
	private String content;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private UserEntity createdBy;

	@Column(nullable = false, updatable = false)
	private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @Column(nullable = false)
    private long viewCount;

	@PrePersist
	void onCreate() {
		if (createdAt == null) {
			createdAt = Instant.now();
		}
        if(updatedAt == null){
            updatedAt = Instant.now();
        }
	}

    @PreUpdate
    void onUpdate() { updatedAt = Instant.now();}

    public void incdrementCount() {viewCount++;}


    public void update(String title, String content) {
        this.title = title;
        this.content = content;
    }
}