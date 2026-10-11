module Posts exposing (main)

import Elmstatic exposing (..)
import Html exposing (..)
import Html.Attributes exposing (attribute, class, href)
import Page
import Post


main : Elmstatic.Layout
main =
    let
        postItem post =
            div [ class "post-list-item" ]
                [ a [ href ("/" ++ post.link) ] [ h2 [] [ text post.title ] ]
                , Post.metadataHtml post
                ]

        postListContent posts =
            if List.isEmpty posts then
                [ text "No posts yet!" ]

            else
                [ div [ attribute "data-post-list" "", attribute "data-page-size" "5" ]
                    (List.map postItem posts)
                , Elmstatic.script "/pagination.js"
                ]

        sortPosts posts =
            List.sortBy .date posts
                |> List.reverse
    in
    Elmstatic.layout Elmstatic.decodePostList <|
        \content ->
            Ok <| Page.layout content.title <| postListContent <| sortPosts content.posts
