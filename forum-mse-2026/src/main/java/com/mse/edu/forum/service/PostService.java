package com.mse.edu.forum.service;

import com.mse.edu.forum.api.generated.model.CreatePostRequest;
import com.mse.edu.forum.api.generated.model.PostResponse;
import com.mse.edu.forum.domain.PostEntity;
import com.mse.edu.forum.mapper.PostMapper;
import com.mse.edu.forum.repo.PostRepository;
import com.mse.edu.forum.security.CurrentUserProvider;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostService {

	private final PostRepository postRepository;
	private final PostMapper postMapper;
    private final CurrentUserProvider currentUserProvider;

	public PostService(PostRepository postRepository,
                       PostMapper postMapper,
                       CurrentUserProvider currentUserProvider) {
		this.postRepository = postRepository;
		this.postMapper = postMapper;
        this.currentUserProvider = currentUserProvider;
	}

	@Transactional(readOnly = true)
	public List<PostResponse> findAll() {
		return postRepository.findAll().stream().map(postMapper::toResponse).toList();
	}

    @Transactional
    public Optional<PostResponse> findByIdAndIncrementViews(Long id) {
        return postRepository.findById(id).map(post -> {
            post.incrementViewCount();
            return postMapper.toResponse(post);
        });
    }

	@Transactional(readOnly = true)
	public Optional<PostResponse> findById(Long id) {
		return postRepository.findById(id).map(postMapper::toResponse);
	}

	@Transactional
	public PostResponse create(CreatePostRequest request) {
		PostEntity postEntity = postMapper.toEntity(request);
		postEntity.setCreatedBy(currentUserProvider.getCurrentUserEntity());
		PostEntity saved = postRepository.save(postEntity);
		return postMapper.toResponse(saved);
	}
}
