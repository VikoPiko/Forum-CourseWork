# RepliesApi

All URIs are relative to *http://localhost:9000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createReply**](RepliesApi.md#createReply) | **POST** /posts/{postId}/replies | Create a reply on a post |
| [**getReplyById**](RepliesApi.md#getReplyById) | **GET** /replies/{id} | Get reply by id |
| [**listRepliesForPost**](RepliesApi.md#listRepliesForPost) | **GET** /posts/{postId}/replies | List replies for a post |


<a id="createReply"></a>
# **createReply**
> ReplyResponse createReply(postId, createReplyRequest)

Create a reply on a post

### Example
```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.auth.*;
import org.openapitools.client.models.*;
import org.openapitools.client.api.RepliesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:9000");
    
    // Configure HTTP bearer authorization: bearerAuth
    HttpBearerAuth bearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("bearerAuth");
    bearerAuth.setBearerToken("BEARER TOKEN");

    RepliesApi apiInstance = new RepliesApi(defaultClient);
    Long postId = 56L; // Long | 
    CreateReplyRequest createReplyRequest = new CreateReplyRequest(); // CreateReplyRequest | 
    try {
      ReplyResponse result = apiInstance.createReply(postId, createReplyRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling RepliesApi#createReply");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **postId** | **Long**|  | |
| **createReplyRequest** | [**CreateReplyRequest**](CreateReplyRequest.md)|  | |

### Return type

[**ReplyResponse**](ReplyResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created |  -  |
| **404** | Post not found |  -  |

<a id="getReplyById"></a>
# **getReplyById**
> ReplyResponse getReplyById(id)

Get reply by id

### Example
```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.models.*;
import org.openapitools.client.api.RepliesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:9000");

    RepliesApi apiInstance = new RepliesApi(defaultClient);
    Long id = 56L; // Long | 
    try {
      ReplyResponse result = apiInstance.getReplyById(id);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling RepliesApi#getReplyById");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **Long**|  | |

### Return type

[**ReplyResponse**](ReplyResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Found |  -  |
| **404** | Not found |  -  |

<a id="listRepliesForPost"></a>
# **listRepliesForPost**
> List&lt;PageReplyResponse&gt; listRepliesForPost(postId, page)

List replies for a post

### Example
```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.models.*;
import org.openapitools.client.api.RepliesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:9000");

    RepliesApi apiInstance = new RepliesApi(defaultClient);
    Long postId = 56L; // Long | 
    Long page = 0L; // Long | 
    try {
      List<PageReplyResponse> result = apiInstance.listRepliesForPost(postId, page);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling RepliesApi#listRepliesForPost");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **postId** | **Long**|  | |
| **page** | **Long**|  | [optional] [default to 0] |

### Return type

[**List&lt;PageReplyResponse&gt;**](PageReplyResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **404** | Post not found |  -  |

