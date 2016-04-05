module Main where

import Html            exposing (..)
import Html.Events     exposing (..)
import Html.Attributes exposing (..)
import Signal          exposing (..)

main : Signal Html
main = Signal.map (view inbox.address) modelSignal

modelSignal : Signal Model
modelSignal = Signal.foldp update initialModel inbox.signal

inbox : Signal.Mailbox Action
inbox = Signal.mailbox NoOp

type alias Model =
  { companyName: String,
    positionTitle: String }

initialModel : Model
initialModel =
  { companyName = "",
    positionTitle = "" }

update : Action -> Model -> Model
update action model =
  case action of
    NoOp ->
      model
    UpdateCompanyName str->
      { model | companyName = str }
    UpdatePositionTitle str->
      { model | positionTitle = str }
    Reset ->
      initialModel

view : Address Action -> Model -> Html
view address model =
  div [
  ] [
    input [
      type' "text",
      placeholder "Company Name",
      value model.companyName,
      on "input" targetValue (\text -> Signal.message address (UpdateCompanyName text))
    ] [],
    input [
      type' "text",
      placeholder "Position Title",
      value model.positionTitle,
      on "input" targetValue (\text -> Signal.message address (UpdatePositionTitle text))
    ] [],
    button [
      onClick address Reset
    ] [ text "Reset" ],
    p [] [ text ("Company Name: " ++ model.companyName) ],
    p [] [ text ("Position Title: " ++ model.positionTitle) ]
  ]

type Action
  = NoOp
  | UpdateCompanyName String
  | UpdatePositionTitle String
  | Reset
